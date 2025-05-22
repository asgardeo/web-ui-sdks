<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { navigateTo } from '#app';
const { signIn, isAuthenticated } = useAuth();

const isLoading = ref(true);

onMounted(async () => {
  try {
    const authStatus = await isAuthenticated();
    if (authStatus) {
      await navigateTo('/home');
    }
  } catch (error) {
    console.error("Authentication check failed:", error);
  } finally {
    isLoading.value = false;
  }
});

const handleSignIn = async () => {
  try {
    await signIn();
  } catch (error) {
    console.error("Sign in failed:", error);
  }
};

const handleCreateAccount = async () => {
  try {
    await signIn();
  } catch (error) {
    console.error("Create account failed:", error);
  }
};
</script>

<template>
  <div class="hero">
    <div v-if="isLoading" class="loading-indicator">
      <p>Loading...</p> </div>
    <template v-else>
      <div class="main-content">
        <img src="/assets/asgardeo.svg" alt="Asgardeo logo" class="logo" />
        <h1>Enhance your application’s IAM experience with <span class="brand">ASGARDEO</span></h1>
        <p class="subtitle">This sample demonstrates the authentication flow of a Nuxt application using Asgardeo.</p>
        <div class="btn-group">
          <button class="btn primary" @click="handleSignIn()">Sign In</button>
          <button class="btn secondary" @click="handleCreateAccount()">Create an account</button>
        </div>
        <a href="https://github.com/wso2-samples/asgardeo-nuxt-sample" target="_blank" class="source-link">
          <svg viewBox="0 0 16 16" width="20" height="20" fill="currentColor" class="github-icon">
            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38
            0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52
            0-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95
            0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04
            2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54
            1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
          </svg>
          Explore the source code
        </a>
      </div>
      <footer class="footer">© 2025 WSO2 LLC.</footer>
    </template>
  </div>
</template>

<style scoped>
.hero {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  text-align: center;
  min-height: 100vh;
  padding: 2rem;
  background: #fff;
  font-family: 'Inter', sans-serif;
}

.loading-indicator {
  font-size: 1.2rem;
  color: #555;
}

.logo {
  width: 80px;
  margin-bottom: 1rem;
}

h1 {
  font-size: clamp(1.5rem, 5vw, 2rem);
  margin: 0.5rem 0;
  font-weight: normal;
  color: #333;
}

.brand {
  font-weight: bold;
  color: #ff7f00;
}

.subtitle {
  font-size: clamp(0.9rem, 3vw, 1rem);
  color: #6c757d;
  margin-bottom: 2rem;
  max-width: 600px;
}

.btn-group {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1.5rem;
  justify-content: center;
}

.btn {
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  border: none;
  transition: background-color 0.3s ease, color 0.3s ease, transform 0.1s ease;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.btn:active {
    transform: translateY(1px);
}

.btn.primary {
  background-color: #ff7f00;
  color: #fff;
}

.btn.primary:hover {
  background-color: #e06600;
}

.btn.secondary {
  background-color: transparent;
  color: #ff7f00;
  border: 2px solid #ff7f00;
}

.btn.secondary:hover {
  background-color: #ff7f00;
  color: #fff;
}

.source-link {
  display: inline-flex;
  align-items: center;
  color: #212529;
  font-size: 0.9rem;
  text-decoration: none;
  margin-bottom: 3rem;
  transition: color 0.3s ease;
}

.source-link:hover {
  color: #ff7f00;
}

.github-icon {
  margin-right: 0.5rem;
}

.footer {
  font-size: 0.8rem;
  color: #adb5bd;
  margin-top: auto;
  padding-top: 1rem;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>
