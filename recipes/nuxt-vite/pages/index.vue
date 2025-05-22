<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { navigateTo } from '#app';

const { signOut, isAuthenticated, getBasicUserInfo } = useAuth();

const userInfo = ref<Record<string, any> | null>(null);
const isLoading = ref(true);

onMounted(async () => {
  try {
    const authStatus = await isAuthenticated();
    if (!authStatus) {
      await navigateTo('/login');
      return;
    }
    userInfo.value = await getBasicUserInfo();
  } catch (error) {
    console.error("Authentication check or user info fetch failed:", error);
    await navigateTo('/login');
  } finally {
    isLoading.value = false;
  }
});

const handleSignOut = async () => {
  try {
    await signOut();
    await navigateTo('/login');
  } catch (error) {
    console.error("Sign out failed:", error);
  }
};
</script>

<template>
  <div class="home-container">
    <div v-if="isLoading" class="loading-indicator">
      <p>Loading user data...</p>
    </div>
    <div v-else-if="userInfo" class="user-dashboard">
      <header class="dashboard-header">
        <img src="/assets/asgardeo.svg" alt="Asgardeo logo" class="logo-small" />
        <h1>Welcome to Your Dashboard</h1>
      </header>
      
      <section class="user-details">
        <h2>Hello, {{ userInfo.displayName || userInfo.username || 'User' }}!</h2>
        <p v-if="userInfo.email">Email: <span>{{ userInfo.email }}</span></p>
        <p v-if="userInfo.sub">User ID: <span>{{ userInfo.sub }}</span></p>
        </section>

      <section class="actions">
        <button @click="handleSignOut" class="btn primary logout-btn">Sign Out</button>
      </section>

      <footer class="dashboard-footer">
        <p>&copy; Powered by Asgardeo.</p>
      </footer>
    </div>
    <div v-else class="error-message">
      <p>Could not load user information. Please try <a href="/login">logging in</a> again.</p>
    </div>
  </div>
</template>

<style scoped>
.home-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 2rem;
  background-color: #f4f7f6;
  font-family: 'Inter', sans-serif;
  color: #333;
}

.loading-indicator {
  font-size: 1.2rem;
  color: #555;
}

.user-dashboard {
  background-color: #fff;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 700px;
  text-align: center;
}

.dashboard-header {
  margin-bottom: 2rem;
  border-bottom: 1px solid #eee;
  padding-bottom: 1rem;
}

.logo-small {
  width: 50px;
  margin-bottom: 0.5rem;
}

.dashboard-header h1 {
  font-size: 1.8rem;
  color: #ff7f00;
  margin: 0;
}

.user-details h2 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: #333;
}

.user-details p {
  font-size: 1rem;
  color: #555;
  margin: 0.5rem 0;
  line-height: 1.6;
}
.user-details p span {
  font-weight: 500;
  color: #333;
}

.actions {
  margin-top: 2rem;
}

.btn {
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  border: none;
  transition: background-color 0.3s ease, transform 0.1s ease;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}
.btn:active {
    transform: translateY(1px);
}

.btn.primary.logout-btn {
  background-color: #d9534f;
  color: #fff;
}

.btn.primary.logout-btn:hover {
  background-color: #c9302c;
}

.dashboard-footer {
  margin-top: 2.5rem;
  padding-top: 1rem;
  border-top: 1px solid #eee;
  font-size: 0.8rem;
  color: #888;
}

.error-message {
  text-align: center;
  color: #d9534f;
}
.error-message a {
  color: #ff7f00;
  text-decoration: underline;
}

@media (max-width: 768px) {
  .user-dashboard {
    padding: 1.5rem;
  }
  .dashboard-header h1 {
    font-size: 1.5rem;
  }
  .user-details h2 {
    font-size: 1.3rem;
  }
}
</style>
