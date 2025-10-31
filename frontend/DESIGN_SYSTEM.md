# Design System - Semed Livingcare

เอกสารนี้กำหนดมาตรฐานการออกแบบสำหรับทั้งระบบ เพื่อให้การพัฒนามีความสอดคล้องและเป็นมาตรฐานเดียวกัน

## 🎨 Color Palette

### Primary Colors (Softer Emerald)
- **Primary**: `emerald-400` → `emerald-500` (hover)
  - ใช้สำหรับ: ปุ่มหลัก, ลิงก์, tab active, checkbox
  - Hex: `#34d399` → `#10b981`
  - **Logo**: `emerald-400` → `teal-400` gradient
  - **Note**: ใช้สีอ่อน (400) เพื่อให้ดูสดใสและไม่แก่เกินไป

### Secondary Colors
- **Secondary**: `teal-400` → `teal-500` (hover)
  - ใช้สำหรับ: gradient, accent elements
  - Hex: `#2dd4bf` → `#14b8a6`

### Background Colors
- **Background Light**: `slate-50` (#f8fafc)
- **Background Medium**: `slate-100` (#f1f5f9)
- ใช้สำหรับ: พื้นหลังทั่วไป, card backgrounds

### Text Colors
- **Text Primary**: `slate-700` (#334155)
  - ใช้สำหรับ: หัวข้อ, ข้อความสำคัญ
- **Text Secondary**: `slate-600` (#475569)
  - ใช้สำหรับ: ข้อความรอง, placeholder

### Border Colors
- **Border Default**: `slate-300` (#cbd5e1)
- **Border Light**: `slate-200` (#e2e8f0)
  - ใช้สำหรับ: input borders, card borders

### Error Colors
- **Error Border**: `red-400` (#f87171)
- **Error Text**: `red-600` (#dc2626)
- **Error Focus**: `red-500` (#ef4444)
  - ใช้สำหรับ: validation errors, error messages

### Gray Scale (สำหรับ Input)
- **Border**: `gray-200` (#e5e7eb)
- **Text**: `gray-700` (#374151)
- **Placeholder**: `gray-400` (#9ca3af)
- **Icon**: `gray-400` (#9ca3af)

## 📏 Spacing System

### Vertical Spacing
- **Form spacing**: `space-y-4` (16px)
  - ใช้สำหรับ: ระยะห่างระหว่าง form fields
- **Section spacing**: `space-y-5` (20px)
  - ใช้สำหรับ: ระยะห่างระหว่าง sections
- **Card padding**: `p-8` (32px)
  - ใช้สำหรับ: padding ภายใน card/container

### Horizontal Spacing
- **Input padding**: `px-3 py-2` (12px 8px)
- **Button padding**: `py-2.5 px-4` (10px 16px)

## 🔲 Border Radius

- **Input fields**: `rounded-lg` (8px)
- **Buttons**: `rounded-lg` (8px)
- **Card**: `rounded-2xl` (16px)
- **Tab container**: `rounded-xl` (12px)

## ✍️ Typography

### Headings
- **Heading 1**: `text-3xl font-bold`
  - ใช้สำหรับ: ชื่อระบบ, หัวข้อหลัก
- **Heading 2**: `text-2xl font-bold`
  - ใช้สำหรับ: หัวข้อย่อย
- **Heading 3**: `text-xl font-semibold`
  - ใช้สำหรับ: หัวข้อภายใน section

### Body Text
- **Labels**: `text-sm font-medium`
  - ใช้สำหรับ: label ของ form fields
- **Body**: `text-sm` (default)
  - ใช้สำหรับ: ข้อความทั่วไป
- **Small**: `text-xs`
  - ใช้สำหรับ: ข้อความเสริม, error messages

## 🔘 Button Styles

### Primary Button (Softer Emerald)
```html
class="w-full bg-gradient-to-r from-emerald-400 to-teal-400 text-white font-semibold py-2.5 rounded-lg hover:from-emerald-500 hover:to-teal-500 focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
```

- **Default**: `bg-gradient-to-r from-emerald-400 to-teal-400` (สีอ่อน สดใส)
- **Hover**: `hover:from-emerald-500 hover:to-teal-500`
- **Focus**: `focus:ring-2 focus:ring-emerald-300 focus:ring-offset-2` (อ่อนลงตามกัน)
- **Disabled**: `disabled:opacity-50 disabled:cursor-not-allowed`

### Secondary Button
```html
class="border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2"
```

### Modal Actions (Consistency)
- ใช้รูปแบบปุ่มเดียวกัน แตกต่างกันแค่โทนสี เพื่อความสอดคล้อง
  - **Confirm/Primary (เช่น เพิ่มแผนก)**:
    ```html
    class="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 shadow-sm hover:shadow-md text-white bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-500 hover:to-teal-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-300 disabled:opacity-50 disabled:cursor-not-allowed"
    ```
  - **Cancel/Secondary (เช่น ยกเลิก)**:
    ```html
    class="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:border-slate-300 hover:text-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-300 transition-all duration-200 shadow-sm hover:shadow"
    ```

### Modal Header/Footer
- Header: `border-slate-200/50`, Title `text-slate-800`
- Footer: `bg-slate-50`

### Toggle (Active status)
- เปิด: `bg-emerald-400`
- ปิด: `bg-gray-300`
- โฟกัส: `focus:ring-emerald-300 focus:ring-2 focus:ring-offset-2`

### Link Colors
- **Default**: `text-emerald-400`
- **Hover**: `hover:text-emerald-500`
- ใช้สำหรับ: ลิงก์ทั้งหมด, links ใน text

### Checkbox Colors
- **Color**: `text-emerald-400`
- **Focus**: `focus:ring-emerald-300 focus:ring-2`

## 📝 Input Styles

### Standard Input
```html
class="w-full px-3 py-2 border border-gray-200 rounded-lg shadow-sm bg-white text-gray-700 placeholder-gray-400 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-300/80 focus:outline-none transition-colors duration-200 hover:border-emerald-400"
```

**คุณสมบัติ:**
- **Base**: `border border-gray-200 rounded-lg shadow-sm bg-white`
- **Text**: `text-gray-700 placeholder-gray-400`
- **Focus**: `focus:border-emerald-400 focus:ring-1 focus:ring-emerald-300/80`
- **Hover**: `hover:border-emerald-400`
- **Transition**: `transition-colors duration-200`

### Input with Icon (Left)
```html
<!-- Icon Container -->
<div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
  <Icon class="w-5 h-5 text-gray-400" />
</div>

<!-- Input with left padding -->
<input class="w-full pl-10 pr-3 py-2 ..." />
```

### Input with Icon (Right)
```html
<!-- Icon Container -->
<div class="absolute right-0 top-0 h-full pr-3 flex items-center">
  <Icon class="w-5 h-5 text-gray-400 hover:text-gray-600" />
</div>

<!-- Input with right padding -->
<input class="w-full pl-3 pr-10 py-2 ..." />
```

### Error State
```html
:class="{ 
  'border-red-400 focus:border-red-500 focus:ring-red-500': errors.fieldName 
}"
```

## 🎭 Shadows & Effects

- **Card**: `shadow-xl`
- **Tab Active**: `shadow-sm`
- **Logo**: `shadow-lg shadow-emerald-400/20` (อ่อนลงตามสีหลัก)
- **Input**: `shadow-sm`

## ⚡ Transitions

- **Default**: `transition-all duration-200`
- **Colors**: `transition-colors duration-200`
- **Transform**: `transition-transform duration-200`

## 📋 Form Components

### Form Field Structure
```html
<div class="space-y-1.5">
  <label class="block text-sm font-medium text-slate-700">
    ชื่อ Field
  </label>
  <div class="relative">
    <!-- Icon (ถ้ามี) -->
    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
      <Icon class="w-5 h-5 text-gray-400" />
    </div>
    
    <!-- Input -->
    <input 
      class="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg shadow-sm bg-white text-gray-700 placeholder-gray-400 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-300/80 focus:outline-none transition-colors duration-200 hover:border-emerald-400"
      :class="{ 'border-red-400 focus:border-red-500': errors.fieldName }"
    />
  </div>
  
  <!-- Error Message -->
  <p v-if="errors.fieldName" class="text-sm text-red-600">
    {{ errors.fieldName }}
  </p>
</div>
```

### Tab Navigation
```html
<div class="flex bg-slate-100 rounded-xl p-1 mb-6">
  <button
    :class="[
      'flex-1 py-2.5 px-4 rounded-lg text-sm font-semibold transition-all duration-200',
      isActive
        ? 'bg-white text-emerald-400 shadow-sm'
        : 'text-slate-600 hover:text-slate-800'
    ]"
  >
    Tab Name
  </button>
</div>
```

## 🎨 Card Components

### Standard Card
```html
<div class="bg-white rounded-2xl shadow-xl p-8 border border-slate-200/50">
  <!-- Content -->
</div>
```

## 🔄 Transitions & Animations

### Fade Transition
```html
<transition name="fade" mode="out-in">
  <!-- Content -->
</transition>
```

```css
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
```

## ✅ Best Practices

1. **ใช้สีตาม Color Palette** - อย่าใช้สีอื่นนอกเหนือจากที่กำหนด
2. **Spacing สม่ำเสมอ** - ใช้ spacing system ให้เป็นมาตรฐาน
3. **Input Style เหมือนกัน** - ทุก input ใช้สไตล์เดียวกัน
4. **Button Style ตามประเภท** - Primary/Secondary ใช้สไตล์ที่กำหนด
5. **Typography Hierarchy** - ใช้ typography scale ให้ถูกต้อง
6. **Error Handling** - แสดง error ด้วยสีและ style ที่กำหนด

## 🎯 Emerald Color Scale (ใช้สีอ่อน 400)

### สีที่ใช้ในระบบ:
- **Button Primary**: `emerald-400` → `emerald-500` (hover)
- **Button Gradient**: `from-emerald-400 to-teal-400` → `from-emerald-500 to-teal-500` (hover)
- **Logo**: `from-emerald-400 to-teal-400`
- **Tab Active**: `text-emerald-400`
- **Links**: `text-emerald-400` → `text-emerald-500` (hover)
- **Checkbox**: `text-emerald-400`
- **Input Focus Border**: `focus:border-emerald-400`
- **Input Focus Ring**: `focus:ring-emerald-300/80`
- **Button Focus Ring**: `focus:ring-emerald-300`

### เหตุผลใช้สีอ่อน (400):
- ดูสดใส ไม่แก่เกินไป
- ให้ความรู้สึกนุ่มนวล สบายตา
- เหมาะกับ medical/healthcare application
- ยังคงความชัดเจนและอ่านง่าย

## 📝 Notes

- ระบบใช้ Tailwind CSS
- Font family: Prompt (กำหนดใน tailwind.config.js)
- รองรับ responsive design
- ใช้ระบบสี gray สำหรับ input เพื่อให้สอดคล้องกับ UserModal
- **สี Emerald ใช้ระดับ 400** (แทน 600) เพื่อให้ดูสดใสและไม่แก่เกินไป

---

**อัปเดตล่าสุด**: เมื่อมีการปรับเปลี่ยน Design System กรุณาอัปเดตเอกสารนี้ด้วย

