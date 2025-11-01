import { PrismaClient } from '@prisma/client'
import XLSX from 'xlsx'
import path from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const prisma = new PrismaClient()

async function seedIcd10() {
  try {
    console.log('🚀 Starting ICD-10 seed...')
    
    // ลบข้อมูล ICD10 เก่าทั้งหมดก่อน (ถ้าต้องการ)
    console.log('🗑️  Deleting all existing ICD10 records...')
    const deleteResult = await prisma.icd10.deleteMany({})
    console.log(`✅ Deleted ${deleteResult.count} existing ICD10 records`)
    
    // ค้นหาหรือสร้าง default category สำหรับ DIAGNOSIS
    let defaultCategoryId = null
    try {
      const defaultCategory = await prisma.itemCategory.findFirst({
        where: {
          categoryType: 'DIAGNOSIS',
          isActive: true
        },
        orderBy: {
          createdAt: 'asc' // เลือกตัวแรกที่สร้าง (หรือ id: 'asc' ก็ได้)
        }
      })
      
      if (defaultCategory) {
        defaultCategoryId = defaultCategory.id
        console.log(`📋 Using default category: ${defaultCategory.name} (ID: ${defaultCategoryId})`)
      } else {
        console.log('⚠️  No DIAGNOSIS category found. ICD10 records will be created without category.')
        console.log('💡 Tip: Create a DIAGNOSIS category first in the ItemCategories page')
      }
    } catch (error) {
      console.log('⚠️  Error finding default category:', error.message)
    }
    
    // อ่านไฟล์ Excel
    const filePath = path.join(__dirname, 'ICD_FULL_107985.xlsx')
    console.log(`📖 Reading file: ${filePath}`)
    
    const workbook = XLSX.readFile(filePath)
    const sheetName = workbook.SheetNames[0] // ใช้ sheet แรก
    const worksheet = workbook.Sheets[sheetName]
    const data = XLSX.utils.sheet_to_json(worksheet)
    
    console.log(`📊 Total rows: ${data.length}`)
    
    // วนลูปสร้างข้อมูล
    let successCount = 0
    let errorCount = 0
    
    for (let i = 0; i < data.length; i++) {
      try {
        const row = data[i]
        
        // ใช้ชื่อคอลัมน์จริงจาก Excel
        const code = row['รหัสโรคย่อย_NO_POINT'] || ''
        const groupCode = row['กลุ่มรหัสโรค'] || null
        const nameTh = row['ชื่อสามัญ (ชื่อรหัสย่อย) [TH]'] || row['ชื่อกลุ่มรหัสโรค [TH]'] || ''
        const nameEn = row['ชื่อสามัญ (ชื่อรหัสย่อย) [Eng]'] || row['ชื่อกลุ่มรหัสโรค [Eng]'] || null
        const groupNameTh = row['ชื่อกลุ่มรหัสโรค [TH]'] || null
        const groupNameEn = row['ชื่อกลุ่มรหัสโรค [Eng]'] || null
        
        if (!code || !nameTh) {
          console.log(`⚠️  Skip row ${i + 1}: Missing code or nameTh`)
          errorCount++
          continue
        }
        
        // upsert ข้อมูล
        await prisma.icd10.upsert({
          where: { code: code },
          update: {
            groupCode: groupCode,
            nameTh: nameTh,
            nameEn: nameEn,
            groupNameTh: groupNameTh,
            groupNameEn: groupNameEn,
            categoryId: defaultCategoryId, // ใช้ default category
            isActive: true
          },
          create: {
            code: code,
            groupCode: groupCode,
            nameTh: nameTh,
            nameEn: nameEn,
            groupNameTh: groupNameTh,
            groupNameEn: groupNameEn,
            categoryId: defaultCategoryId, // ใช้ default category
            isActive: true
          }
        })
        
        successCount++
        
        if ((i + 1) % 100 === 0) {
          console.log(`✅ Processed: ${i + 1}/${data.length}`)
        }
      } catch (error) {
        console.error(`❌ Error at row ${i + 1}:`, error.message)
        errorCount++
      }
    }
    
    console.log('\n✨ Seed completed!')
    console.log(`✅ Success: ${successCount}`)
    console.log(`❌ Errors: ${errorCount}`)
    
  } catch (error) {
    console.error('💥 Fatal error:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

seedIcd10()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })

