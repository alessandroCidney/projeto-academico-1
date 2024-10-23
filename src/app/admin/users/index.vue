<template>
  <div class="pageContainer">
    <div class="d-flex align-center mb-8">
      <v-btn
        icon="mdi-chevron-left"
        variant="tonal"
        class="mr-5"
        @click="$router.push('/')"
      />

      <h1 class="text-h5 font-weight-bold">
        Painel do Admin
      </h1>
    </div>

    <div>
      <h2 class="text-h6 font-weight-bold">
        Usuários Cadastrados
      </h2>

      <v-list>
        <template
          v-for="(userData, userIndex) in users"
          :key="`user${userIndex}`"
        >
          <v-list-item class="py-3">
            <template #prepend>
              <v-avatar>
                <v-img
                  :src="''"
                />
              </v-avatar>
            </template>

            <template #title>
              {{ userData.displayName }}
            </template>

            <template #subtitle>
              {{ userData.position }}
            </template>

            <template #append>
              <v-btn
                icon="mdi-pencil"
                variant="text"
              />

              <v-btn
                icon="mdi-delete"
                variant="text"
              />
            </template>
          </v-list-item>

          <v-divider />
        </template>
      </v-list>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'

import { useUsersService } from '@/composables/services/useUsersService'

const usersService = useUsersService()

const users = ref<Awaited<ReturnType<typeof usersService.list>>>([])

onMounted(async () => {
  users.value = await usersService.list()
})
</script>
