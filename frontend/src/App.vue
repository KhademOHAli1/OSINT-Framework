<template>
  <div id="app" class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
    <!-- Header -->
    <header class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50 shadow-sm transition-colors duration-300">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
        <div class="flex items-center justify-between space-x-2 sm:space-x-4">
          <!-- Logo and Title -->
          <div class="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
            <div class="w-8 h-8 xs:w-9 xs:h-9 sm:w-10 sm:h-10 lg:w-11 lg:h-11 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg">
              <span class="text-white font-bold text-xs xs:text-sm sm:text-base lg:text-lg">O</span>
            </div>
            <div class="hidden xs:block sm:block">
              <h1 class="text-sm xs:text-base sm:text-lg lg:text-xl font-bold text-gray-900 dark:text-white">OSINT Framework</h1>
            </div>
          </div>
          
          <!-- Search Bar -->
          <div class="flex-1 max-w-md sm:max-w-2xl">
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                <svg class="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </div>
              <input
                v-model="appStore.searchTerm"
                type="text"
                placeholder="Search OSINT tools..."
                class="block w-full pl-10 sm:pl-12 pr-10 sm:pr-12 py-2 sm:py-3 border border-gray-200 dark:border-gray-600 rounded-lg sm:rounded-xl bg-gray-50 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:bg-white dark:hover:bg-gray-600 focus:bg-white dark:focus:bg-gray-600 text-sm sm:text-base"
              />
              <button
                v-if="appStore.searchTerm"
                @click="appStore.clearSearch()"
                class="absolute inset-y-0 right-0 pr-3 sm:pr-4 flex items-center"
              >
                <svg class="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 hover:text-gray-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
          </div>
          
          <!-- Action buttons -->
          <div class="flex items-center space-x-1 sm:space-x-2 lg:space-x-3 flex-shrink-0">
            <!-- Dark Mode Toggle -->
            <button 
              @click="appStore.toggleDarkMode()"
              class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              title="Toggle Dark Mode"
            >
              <svg v-if="!appStore.isDarkMode" class="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>
              </svg>
              <svg v-else class="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>
              </svg>
            </button>
            
            <button class="bg-gray-900 dark:bg-gray-700 text-white px-2 sm:px-3 lg:px-6 py-2 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-600 font-medium transition-all duration-200 shadow-sm hover:shadow-md text-xs sm:text-sm lg:text-base">
              Contribute
            </button>
          </div>
        </div>
      </div>
    </header>
    
    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6 lg:py-8 space-y-4 sm:space-y-6 lg:space-y-8">
      <!-- Framework Tree Section -->
      <section class="space-y-3 sm:space-y-4 lg:space-y-6">
        <!-- Tree Framework Container -->
        <TreeContainer />
      </section>
      
      <!-- About Section -->
      <section class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6 lg:p-8 xl:p-12 transition-colors duration-300">
        <div class="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 mb-6 sm:mb-8">
          <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
            <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <div>
            <h2 class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">About OSINT Framework</h2>
            <p class="text-gray-600 dark:text-gray-300 text-sm sm:text-base">The definitive intelligence gathering resource</p>
          </div>
        </div>
        
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          <!-- Description -->
          <div class="lg:col-span-2 space-y-4 sm:space-y-6">
            <div class="prose prose-lg text-gray-700 dark:text-gray-300">
              <p class="text-lg sm:text-xl leading-relaxed">
                The OSINT Framework is the definitive collection of <span class="font-semibold text-gray-900 dark:text-white">free intelligence gathering resources</span> used by digital investigators, cybersecurity professionals, and researchers worldwide.
              </p>
              <p class="leading-relaxed text-sm sm:text-base">
                Our curated database includes <span class="font-semibold text-blue-600 dark:text-blue-400">500+ verified tools</span> across multiple categories, ensuring you have access to the most effective resources for your investigations.
              </p>
            </div>
          </div>
          
          <!-- Get Involved -->
          <div class="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 rounded-2xl p-6 sm:p-8 transition-colors duration-300">
            <h3 class="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6 flex items-center space-x-3">
              <svg class="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
              </svg>
              <span>Get Involved</span>
            </h3>
            <div class="space-y-3 sm:space-y-4">
              <div class="flex items-start space-x-3 sm:space-x-4">
                <div class="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg class="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <div>
                  <div class="font-medium text-gray-900 dark:text-white text-sm sm:text-base">Submit Tools</div>
                  <div class="text-gray-600 dark:text-gray-300 text-xs sm:text-sm">Add new tools via GitHub pull requests</div>
                </div>
              </div>
              <div class="flex items-start space-x-3 sm:space-x-4">
                <div class="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg class="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <div>
                  <div class="font-medium text-gray-900 dark:text-white text-sm sm:text-base">Report Issues</div>
                  <div class="text-gray-600 dark:text-gray-300 text-xs sm:text-sm">Suggest improvements and bug fixes</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
    
    <!-- Footer -->
    <footer class="bg-gray-900 dark:bg-gray-950 text-white transition-colors duration-300">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6 lg:py-8">
        <div class="flex flex-col space-y-4 lg:flex-row lg:justify-between lg:items-center lg:space-y-0">
          <!-- Brand -->
          <div class="flex items-center space-x-3">
            <div class="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span class="text-white font-bold">O</span>
            </div>
            <div>
              <div class="font-semibold text-sm sm:text-base">OSINT Framework</div>
              <div class="text-gray-400 text-xs sm:text-sm">© 2025 Open source intelligence resources</div>
            </div>
          </div>
          
          <!-- Links -->
          <div class="flex flex-wrap items-center gap-4 sm:gap-6">
            <a href="https://github.com/jivoi/osint" target="_blank" class="text-gray-400 hover:text-white transition-colors text-sm">
              GitHub
            </a>
            <a href="https://github.com/jivoi/osint/issues" target="_blank" class="text-gray-400 hover:text-white transition-colors text-sm">
              Issues
            </a>
            <a href="https://github.com/jivoi/osint/blob/master/CONTRIBUTING.md" target="_blank" class="text-gray-400 hover:text-white transition-colors text-sm">
              Contribute
            </a>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useAppStore } from './stores/app'
import { useAppData } from './composables/useAppData'
import TreeContainer from './components/tree/TreeContainer-fixed.vue'

const appStore = useAppStore()

// Initialize app data
useAppData()

onMounted(() => {
  // Initialize dark mode from localStorage or system preference
  appStore.initializeDarkMode()
})
</script>
