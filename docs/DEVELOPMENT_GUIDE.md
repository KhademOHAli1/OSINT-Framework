# Quick Development Guide

## 🚀 Adding New Components

### 1. Layout Components
Place in `src/components/layout/` for structural elements:

```vue
<template>
  <section class="max-w-6xl mx-auto p-4">
    <slot />
  </section>
</template>

<script setup lang="ts">
// Layout logic
</script>
```

### 2. UI Components  
Place in `src/components/ui/` for reusable elements:

```vue
<template>
  <button 
    @click="handleClick"
    class="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg 
           transition-colors duration-200 focus:outline-none focus:ring-2 
           focus:ring-blue-500 focus:ring-offset-2"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
interface Props {
  variant?: 'primary' | 'secondary'
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  disabled: false
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const handleClick = (event: MouseEvent) => {
  if (!props.disabled) {
    emit('click', event)
  }
}
</script>
```

### 3. Feature Components
Place in `src/components/[feature]/` for specific features:

```vue
<template>
  <div class="feature-container">
    <FeatureHeader :title="title" />
    <FeatureContent :data="data" />
    <FeatureFooter @action="handleAction" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAppStore } from '../../stores/app'
import FeatureHeader from './FeatureHeader.vue'
import FeatureContent from './FeatureContent.vue'
import FeatureFooter from './FeatureFooter.vue'

interface Props {
  title: string
}

const props = defineProps<Props>()
const store = useAppStore()

const data = computed(() => store.someData)

const handleAction = (action: string) => {
  store.performAction(action)
}
</script>
```

## 🎯 State Management Patterns

### Reading State
```typescript
import { computed } from 'vue'
import { useAppStore } from '../../stores/app'

const store = useAppStore()
const isDarkMode = computed(() => store.isDarkMode)
const searchTerm = computed(() => store.searchTerm)
```

### Updating State
```typescript
// Simple updates
store.setSearchTerm('new search')
store.toggleDarkMode()

// Complex updates
store.updateUserPreferences({
  theme: 'dark',
  language: 'en'
})
```

## 🎨 Tailwind CSS Patterns

### Responsive Design
```html
<div class="
  w-full           
  sm:w-1/2         
  md:w-1/3         
  lg:w-1/4         
  xl:w-1/5         
">
```

### Dark Mode
```html
<div class="
  bg-white dark:bg-gray-800
  text-gray-900 dark:text-gray-100
  border-gray-200 dark:border-gray-700
">
```

### Interactive States
```html
<button class="
  bg-blue-500 hover:bg-blue-600 focus:bg-blue-700
  transform hover:-translate-y-0.5 active:translate-y-0
  transition-all duration-200
  focus:outline-none focus:ring-2 focus:ring-blue-500
">
```

### Loading States
```html
<div class="animate-pulse">
  <div class="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
  <div class="h-4 bg-gray-300 rounded w-1/2"></div>
</div>
```

## 🔧 Common Composables

### Data Fetching
```typescript
import { ref, onMounted } from 'vue'

export function useApiData<T>(url: string) {
  const data = ref<T | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetch = async () => {
    loading.value = true
    error.value = null
    
    try {
      const response = await fetch(url)
      data.value = await response.json()
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unknown error'
    } finally {
      loading.value = false
    }
  }

  onMounted(fetch)

  return { data, loading, error, refetch: fetch }
}
```

### Local Storage
```typescript
import { ref, watch } from 'vue'

export function useLocalStorage<T>(key: string, defaultValue: T) {
  const stored = localStorage.getItem(key)
  const value = ref<T>(stored ? JSON.parse(stored) : defaultValue)

  watch(
    value,
    (newValue) => {
      localStorage.setItem(key, JSON.stringify(newValue))
    },
    { deep: true }
  )

  return value
}
```

### Debounced Input
```typescript
import { ref, watch } from 'vue'

export function useDebouncedValue<T>(value: Ref<T>, delay: number = 300) {
  const debouncedValue = ref<T>(value.value)

  let timeout: number

  watch(value, (newValue) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => {
      debouncedValue.value = newValue
    }, delay)
  })

  return debouncedValue
}
```

## 📦 Component Templates

### Modal Component
```vue
<template>
  <Teleport to="body">
    <div 
      v-if="isOpen"
      class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      @click.self="close"
    >
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-2xl max-w-md w-full mx-4">
        <div class="p-6">
          <slot />
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
interface Props {
  isOpen: boolean
}

defineProps<Props>()

const emit = defineEmits<{
  close: []
}>()

const close = () => emit('close')
</script>
```

### Form Input Component
```vue
<template>
  <div class="space-y-1">
    <label 
      v-if="label"
      :for="id"
      class="block text-sm font-medium text-gray-700 dark:text-gray-300"
    >
      {{ label }}
    </label>
    <input
      :id="id"
      :value="modelValue"
      :type="type"
      :placeholder="placeholder"
      :disabled="disabled"
      class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
             bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
             focus:ring-2 focus:ring-blue-500 focus:border-transparent
             disabled:opacity-50 disabled:cursor-not-allowed
             transition-all duration-200"
      @input="handleInput"
    />
    <p 
      v-if="error" 
      class="text-sm text-red-600 dark:text-red-400"
    >
      {{ error }}
    </p>
  </div>
</template>

<script setup lang="ts">
interface Props {
  id?: string
  label?: string
  modelValue: string
  type?: string
  placeholder?: string
  disabled?: boolean
  error?: string
}

withDefaults(defineProps<Props>(), {
  type: 'text'
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}
</script>
```

## 🎯 Quick Checklist for New Components

- [ ] Component is in the correct directory
- [ ] Uses TypeScript with proper interfaces
- [ ] Includes Tailwind CSS classes
- [ ] Has dark mode support
- [ ] Is responsive (mobile-first)
- [ ] Uses semantic HTML
- [ ] Has proper accessibility attributes
- [ ] Emits events for parent communication
- [ ] Uses store for shared state
- [ ] Includes loading/error states if needed
- [ ] Has smooth transitions/animations
- [ ] Is documented with JSDoc comments

---

This guide should help you quickly create new components that follow the established patterns and maintain consistency across the application.
