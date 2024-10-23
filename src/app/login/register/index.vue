<template>
  <div
    v-if="loadingRegister"
    class="fill-width fill-height d-flex align-center justify-center"
  >
    <v-progress-circular
      size="150"
      width="8"
      color="primary"
      indeterminate
    />
  </div>

  <login-page-container v-else-if="authenticatedUserCredential">
    <div class="font-weight-bold mb-5">
      Preencha os dados do seu perfil:
    </div>

    <v-form>
      <div class="mb-5">
        <v-text-field
          v-model="userCreationPayload.public.displayName"
          label="Nome"
          placeholder="Digite o seu nome"
          variant="outlined"
        />

        <v-combobox
          v-model="userCreationPayload.public.position"
          :items="['Avaliador', 'Estudante', 'Visitante', 'Outro']"
          offset="top"
          label="Cargo"
          placeholder="Digite o seu cargo"
          variant="outlined"
          max-height="500px"
        />
      </div>

      <div class="d-flex align-center justify-center">
        <v-btn
          :style="{ width: 'calc(50% - 8px) !important' }"
          class="normalLetterSpacing mr-2"
          color="grey-lighten-4"
          variant="flat"
          size="large"
          @click="handleCancel()"
        >
          Cancelar
        </v-btn>

        <v-btn
          :style="{ width: '50% !important' }"
          class="normalLetterSpacing"
          color="primary"
          variant="flat"
          size="large"
          @click="handleCompleteRegistration()"
        >
          Continuar
        </v-btn>
      </div>
    </v-form>
  </login-page-container>

  <login-page-container v-else>
    <v-btn
      class="normalLetterSpacing mb-5"
      prepend-icon="mdi-google"
      variant="tonal"
      color="error"
      size="large"
      block
      @click="handleRegisterWithGoogle"
    >
      Registre-se com o Google
    </v-btn>

    <div class="my-5 d-flex align-center justify-center">
      <v-divider />

      <div class="mx-10">ou</div>

      <v-divider />
    </div>

    <div class="font-weight-bold mb-5">
      Registre-se com e-mail e senha
    </div>

    <v-form>
      <div class="mb-5">
        <v-text-field
          label="E-mail"
          placeholder="Digite seu e-mail"
          variant="outlined"
        />

        <v-text-field
          label="Senha"
          placeholder="Digite a senha desejada"
          variant="outlined"
        />

        <v-text-field
          label="Confirme a senha"
          placeholder="Digite a senha novamente"
          variant="outlined"
        />
      </div>

      <div class="d-flex align-center justify-center">
        <v-btn
          :style="{ width: 'calc(50% - 8px) !important' }"
          class="normalLetterSpacing mr-2"
          color="grey-lighten-4"
          variant="flat"
          size="large"
          @click="handleCancel()"
        >
          Cancelar
        </v-btn>

        <v-btn
          :style="{ width: '50% !important' }"
          class="normalLetterSpacing"
          color="primary"
          variant="flat"
          size="large"
        >
          Continuar
        </v-btn>
      </div>
    </v-form>
  </login-page-container>
</template>

<script setup lang="ts">
import { GoogleAuthProvider, signInWithPopup, signOut, type UserCredential } from 'firebase/auth'

import LoginPageContainer from '~/components/login/LoginPageContainer.vue'
import { FirestoreUser, FirestoreUserPersonalData, useUsersService } from '~/composables/services/useUsersService'

const nuxtApp = useNuxtApp()

const usersService = useUsersService()

const loadingRegister = ref(false)

const authenticatedUserCredential = ref<UserCredential>()

const userCreationPayload = ref({
  public: new FirestoreUser(),
  private: new FirestoreUserPersonalData(),
})

async function handleRegisterWithGoogle () {
  try {
    loadingRegister.value = true

    const googleProvider = new GoogleAuthProvider()

    const userCredential = await signInWithPopup(nuxtApp.$firebaseAuth, googleProvider)

    const userAlreadyExists = await usersService.checkIfExists(userCredential.user.uid)

    if (userAlreadyExists) {
      await signOut(nuxtApp.$firebaseAuth)
      throw new Error('User already exists')
    } else {
      authenticatedUserCredential.value = userCredential
    }
  } catch (err) {
    console.error(err)
  } finally {
    loadingRegister.value = false
  }
}

async function handleCompleteRegistration () {
  try {
    loadingRegister.value = true

    if (!authenticatedUserCredential.value) {
      throw new Error('Cannot found user data')
    }

    if (!authenticatedUserCredential.value.user.email) {
      throw new Error('Cannot found user email')
    }

    await usersService.create(authenticatedUserCredential.value.user.uid, {
      ...userCreationPayload.value.public,
      _id: authenticatedUserCredential.value.user.uid,
      createdAt: new Date().toISOString(),
      role: 'Viewer',
    })

    await usersService
      .useUserPrivateDataService(authenticatedUserCredential.value.user.uid)
      .createPersonalData({
        email: authenticatedUserCredential.value.user.email,
        createdAt: new Date().toISOString(),
        updatedAt: null,
      })

    reloadNuxtApp()
  } catch (err) {
    console.error(err)
  } finally {
    loadingRegister.value = false
  }
}

async function handleCancel () {
  try {
    if (authenticatedUserCredential.value) {
      await signOut(nuxtApp.$firebaseAuth)
    }
  } catch (err) {
    console.error(err)
  } finally {
    await navigateTo({ path: '/login' })
  }
}
</script>
