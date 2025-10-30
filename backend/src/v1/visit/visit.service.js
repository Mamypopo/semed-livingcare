import { prisma } from "../config/db.js"
import { logVisit } from "../Loggers/visitLogger.js"

export const visitService = {
  async create(payload) {
    // Basic required fields
    const {
      patientId,
      registrationId,
      doctorId,
      operatorId,
      departmentId,
      branchId,
      visitAt,
      vitals = {},
      clinical = {},
      pain = {},
      swelling = {},
      diagnoses = [],
      chart = null
    } = payload || {}

    if (!patientId || !branchId) {
      throw new Error("patientId และ branchId เป็นค่าว่างไม่ได้")
    }

    return await prisma.$transaction(async (tx) => {
      // กำหนดลำดับ visit ภายใต้ registration (ถ้ามี)
      let visitSeq = null
      if (registrationId) {
        await tx.registration.update({
          where: { id: String(registrationId) },
          data: { visitSeqCurrent: { increment: 1 } }
        })
        const reg = await tx.registration.findUnique({ where: { id: String(registrationId) }, select: { visitSeqCurrent: true } })
        visitSeq = reg?.visitSeqCurrent || 1
      }
      const visit = await tx.visit.create({
        data: {
          patientId: parseInt(patientId),
          registrationId: registrationId || null,
          visitSeq: visitSeq,
          doctorId: toIntOrNull(doctorId),
          operatorId: toIntOrNull(operatorId),
          departmentId: departmentId || null,
          branchId: parseInt(branchId),
          visitAt: visitAt ? new Date(visitAt) : undefined,
          createdBy: emptyToNull(payload?.createdBy),
          updatedBy: emptyToNull(payload?.updatedBy),

          // Vitals
          weightKg: toDecimalOrNull(vitals.weight),
          heightCm: toDecimalOrNull(vitals.height),
          bmi: toDecimalOrNull(vitals.bmi),
          bsa: toDecimalOrNull(vitals.bsa),
          temperatureC: toDecimalOrNull(vitals.temperature),
          bpSys: toIntOrNull(vitals.bpSys),
          bpDia: toIntOrNull(vitals.bpDia),
          pulseRate: toIntOrNull(vitals.pulseRate),
          respiratoryRate: toIntOrNull(vitals.respiratoryRate),
          vas: toDecimalOrNull(vitals.vas),
          o2Sat: toDecimalOrNull(vitals.o2sat),
          crt: emptyToNull(vitals.crt),
          headCircumferenceCm: toDecimalOrNull(vitals.headCircumference),
          chestCircumferenceCm: toDecimalOrNull(vitals.chestCircumference),
          waistCircumferenceCm: toDecimalOrNull(vitals.waistCircumference),
          alcohol: emptyToNull(vitals.alcohol),
          smoking: emptyToNull(vitals.smoking),
          customFields: payload?.vitals?.customFields || null,

          // Clinical notes
          cc: emptyToNull(clinical.cc),
          hpi: emptyToNull(clinical.hpi),
          pmh: emptyToNull(clinical.pmh),
          dxText: emptyToNull(clinical.dx),
          ga: emptyToNull(clinical.ga),
          pe: emptyToNull(clinical.pe),
          doctorAdvice: emptyToNull(clinical.doctorAdvice),
          doctorNote: emptyToNull(clinical.doctorNote),

          // Pain
          painVas: toDecimalOrNull(pain.painLevel ?? pain.vas),
          painType: emptyToNull(pain.painType),
          painLocation: emptyToNull(pain.painLocation),

          // Swelling
          swellingLevel: emptyToNull(swelling.level),
          swellingType: emptyToNull(swelling.type),
          swellingLocation: emptyToNull(swelling.location),

          // MC
          mcNotRest: payload?.vitals?.mcNotRest ?? null,
          mcRestFrom: payload?.vitals?.mcStartDate ? new Date(payload.vitals.mcStartDate) : null,
          mcRestTo: payload?.vitals?.mcEndDate ? new Date(payload.vitals.mcEndDate) : null,
          mcCanFly: payload?.vitals?.canFly ?? null,

          // Chart (body marking) JSON payload
          chart: chart || null
        }
      })

      // fetch patient hn for logging
      const patient = await tx.patient.findUnique({ where: { id: parseInt(patientId) }, select: { hn: true } })

      await logVisit(tx, {
        visitId: visit.id,
        action: 'CREATE_VISIT',
        details: {
          registrationId: registrationId || null,
          hasDiagnoses: Array.isArray(diagnoses) && diagnoses.length > 0,
          diagnoses: (Array.isArray(diagnoses) ? diagnoses : []).map(d => ({ code: (d?.code || '').trim() })).filter(d => d.code)
        },
        userId: operatorId || doctorId || null,
        branchId,
        hn: patient?.hn || null
      })

      let created = 0
      if (Array.isArray(diagnoses) && diagnoses.length) {
        for (const dx of diagnoses) {
          const code = (dx?.code || "").trim()
          if (!code) continue
          const icd = await tx.icd10.findUnique({ where: { code } })
          if (!icd) continue
          await tx.visitDiagnosis.create({
            data: {
              visitId: visit.id,
              icd10Id: icd.id
            }
          })
          created++
        }
      }

      return { visit, diagnosesCreated: created }
    })
  }
  ,
  async listByPatient(patientId) {
    if (!patientId) throw new Error('patientId จำเป็น')
    const pid = parseInt(patientId)
    const items = await prisma.visit.findMany({
      where: { patientId: pid, isActive: true },
      orderBy: { createdAt: 'asc' },
      include: {
        doctor: { select: { id: true, name: true } },
        registration: {
          select: {
            id: true,
            vnNumber: true,
              opdNumber: true,
            queue: { select: { queueNumber: true } }
          }
        }
      }
    })
    return items
  },
  async getById(id) {
    if (!id) throw new Error('id จำเป็น')
    const vid = String(id)
    const item = await prisma.visit.findUnique({
      where: { id: vid },
      include: {
        doctor: { select: { id: true, name: true } },
        registration: { select: { id: true, vnNumber: true, opdNumber: true, queue: { select: { queueNumber: true } } } },
        diagnoses: { include: { icd10: true } }
      }
    })
    return item
  },
  async update(id, payload) {
    if (!id) throw new Error('id จำเป็น')
    const vid = String(id)
    const {
      doctorId,
      operatorId,
      departmentId,
      branchId,
      visitAt,
      vitals = {},
      clinical = {},
      pain = {},
      swelling = {},
      diagnoses = [],
      chart = null
    } = payload || {}

    return await prisma.$transaction(async (tx) => {
      const visit = await tx.visit.update({
        where: { id: vid },
        data: {
          doctorId: toIntOrNull(doctorId),
          operatorId: toIntOrNull(operatorId),
          departmentId: departmentId || null,
          branchId: branchId ? parseInt(branchId) : undefined,
          visitAt: visitAt ? new Date(visitAt) : undefined,
          updatedBy: emptyToNull(payload?.updatedBy),

          weightKg: toDecimalOrNull(vitals.weight),
          heightCm: toDecimalOrNull(vitals.height),
          bmi: toDecimalOrNull(vitals.bmi),
          bsa: toDecimalOrNull(vitals.bsa),
          temperatureC: toDecimalOrNull(vitals.temperature),
          bpSys: toIntOrNull(vitals.bpSys),
          bpDia: toIntOrNull(vitals.bpDia),
          pulseRate: toIntOrNull(vitals.pulseRate),
          respiratoryRate: toIntOrNull(vitals.respiratoryRate),
          vas: toDecimalOrNull(vitals.vas),
          o2Sat: toDecimalOrNull(vitals.o2sat),
          crt: emptyToNull(vitals.crt),
          headCircumferenceCm: toDecimalOrNull(vitals.headCircumference),
          chestCircumferenceCm: toDecimalOrNull(vitals.chestCircumference),
          waistCircumferenceCm: toDecimalOrNull(vitals.waistCircumference),
          alcohol: emptyToNull(vitals.alcohol),
          smoking: emptyToNull(vitals.smoking),
          customFields: payload?.vitals?.customFields || null,

          cc: emptyToNull(clinical.cc),
          hpi: emptyToNull(clinical.hpi),
          pmh: emptyToNull(clinical.pmh),
          dxText: emptyToNull(clinical.dx),
          ga: emptyToNull(clinical.ga),
          pe: emptyToNull(clinical.pe),
          doctorAdvice: emptyToNull(clinical.doctorAdvice),
          doctorNote: emptyToNull(clinical.doctorNote),

          painVas: toDecimalOrNull(pain.painLevel ?? pain.vas),
          painType: emptyToNull(pain.painType),
          painLocation: emptyToNull(pain.painLocation),

          swellingLevel: emptyToNull(swelling.level),
          swellingType: emptyToNull(swelling.type),
          swellingLocation: emptyToNull(swelling.location),

          mcNotRest: payload?.vitals?.mcNotRest ?? null,
          mcRestFrom: payload?.vitals?.mcStartDate ? new Date(payload.vitals.mcStartDate) : null,
          mcRestTo: payload?.vitals?.mcEndDate ? new Date(payload.vitals.mcEndDate) : null,
          mcCanFly: payload?.vitals?.canFly ?? null,

          // Chart (body marking)
          chart: chart === undefined ? undefined : chart
        },
        include: { patient: { select: { hn: true } } }
      })

      // replace diagnoses
      await tx.visitDiagnosis.deleteMany({ where: { visitId: vid } })
      let created = 0
      if (Array.isArray(diagnoses) && diagnoses.length) {
        for (const dx of diagnoses) {
          const code = (dx?.code || '').trim()
          if (!code) continue
          const icd = await tx.icd10.findUnique({ where: { code } })
          if (!icd) continue
          await tx.visitDiagnosis.create({ data: { visitId: vid, icd10Id: icd.id } })
          created++
        }
      }

      await logVisit(tx, {
        visitId: visit.id,
        action: 'UPDATE_VISIT',
        details: {
          hasDiagnoses: Array.isArray(diagnoses) && diagnoses.length > 0,
          diagnoses: (Array.isArray(diagnoses) ? diagnoses : []).map(d => ({ code: (d?.code || '').trim() })).filter(d => d.code)
        },
        userId: toIntOrNull(payload?.operatorId) || toIntOrNull(payload?.doctorId) || null,
        branchId: visit.branchId,
        hn: visit?.patient?.hn || null
      })

      return { visit, diagnosesUpdated: created }
    })
  }
  ,
  async cancel(id, userId) {
    if (!id) throw new Error('id จำเป็น')
    const vid = String(id)
    return await prisma.$transaction(async (tx) => {
      const visit = await tx.visit.update({
        where: { id: vid },
        data: {
          isActive: false,
          cancelledAt: new Date(),
          cancelledBy: userId ? parseInt(userId) : null,
          updatedBy: userId ? String(userId) : undefined,
        },
        include: { patient: { select: { hn: true } } }
      })

      await logVisit(tx, {
        visitId: visit.id,
        action: 'CANCEL_VISIT',
        details: {},
        userId: userId ? parseInt(userId) : null,
        branchId: visit.branchId,
        hn: visit?.patient?.hn || null,
      })

      return { visit }
    })
  }
}

function emptyToNull(v) {
  if (v === undefined || v === null) return null
  if (typeof v === 'string' && v.trim() === '') return null
  return v
}

function toIntOrNull(v) {
  if (v === undefined || v === null || v === '') return null
  const n = parseInt(v, 10)
  return Number.isNaN(n) ? null : n
}

function toDecimalOrNull(v) {
  if (v === undefined || v === null || v === '') return null
  const n = Number(v)
  return Number.isNaN(n) ? null : n
}


