import { prisma } from "../config/db.js"
import { logVisit } from "../utils/visitLogger.js"

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
      diagnoses = []
    } = payload || {}

    if (!patientId || !branchId) {
      throw new Error("patientId และ branchId เป็นค่าว่างไม่ได้")
    }

    return await prisma.$transaction(async (tx) => {
      const visit = await tx.visit.create({
        data: {
          patientId,
          registrationId: registrationId || null,
          doctorId: doctorId || null,
          operatorId: operatorId || null,
          departmentId: departmentId || null,
          branchId,
          visitAt: visitAt ? new Date(visitAt) : undefined,

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
          measuredAt: vitals.measuredAt ? new Date(vitals.measuredAt) : null,

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
          swellingLevelText: emptyToNull(swelling.levelText),
          swellingType: emptyToNull(swelling.type),
          swellingLocation: emptyToNull(swelling.location),

          // MC
          mcNotRest: payload?.vitals?.mcNotRest ?? null,
          mcRestFrom: payload?.vitals?.mcStartDate ? new Date(payload.vitals.mcStartDate) : null,
          mcRestTo: payload?.vitals?.mcEndDate ? new Date(payload.vitals.mcEndDate) : null,
          mcCanFly: payload?.vitals?.canFly ?? null
        }
      })

      // fetch patient hn for logging
      const patient = await tx.patient.findUnique({ where: { id: patientId }, select: { hn: true } })

      await logVisit(tx, {
        visitId: visit.id,
        action: 'CREATE_VISIT',
        details: {
          registrationId: registrationId || null,
          hasDiagnoses: Array.isArray(diagnoses) && diagnoses.length > 0
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
              icd10Id: icd.id,
              note: dx?.note || null
            }
          })
          created++

          await logVisit(tx, {
            visitId: visit.id,
            action: 'ADD_DX',
            details: { code, icd10Id: icd.id },
            userId: operatorId || doctorId || null,
            branchId,
            hn: patient?.hn || null
          })
        }
      }

      return { visit, diagnosesCreated: created }
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


