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

    <v-form
      v-model="fillProfileDataFormIsValid"
      @submit.prevent="handleCompleteRegistration"
    >
      <div class="mb-5">
        <v-text-field
          v-model="userCreationPayload.public.displayName"
          :rules="[rules.required, rules.maxLength(200)]"
          label="Nome"
          placeholder="Digite o seu nome"
          variant="outlined"
        />

        <v-combobox
          v-model="userCreationPayload.public.position"
          :rules="[rules.required]"
          :items="['Avaliador', 'Estudante', 'Visitante', 'Outro']"
          offset="top"
          label="Cargo"
          placeholder="Digite o seu cargo"
          variant="outlined"
          max-height="500px"
        />
      </div>

      <div class="d-flex align-center justify-center ga-2">
        <v-btn
          class="normalLetterSpacing flex-fill"
          color="grey-lighten-4"
          variant="flat"
          size="large"
          @click="handleCancel()"
        >
          Cancelar
        </v-btn>

        <v-btn
          :disabled="!fillProfileDataFormIsValid"
          type="submit"
          class="normalLetterSpacing flex-fill"
          color="primary"
          variant="flat"
          size="large"
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

    <v-form
      v-model="registerFormIsValid"
      @submit.prevent="handleRegisterWithEmailAndPassword"
    >
      <div class="mb-5">
        <v-text-field
          v-model="emailRegisterFormData.email"
          :rules="[rules.required, rules.email]"
          label="E-mail"
          placeholder="Digite seu e-mail"
          variant="outlined"
        />

        <password-text-field
          v-model="emailRegisterFormData.password"
          :rules="[rules.required, rules.strongPassword]"
          label="Senha"
          placeholder="Digite a senha desejada"
          variant="outlined"
        />

        <password-text-field
          v-model="emailRegisterFormData.passwordConfirmation"
          :rules="[rules.required, rules.valuesAreEqual(emailRegisterFormData.password)]"
          :depends-on="emailRegisterFormData.password"
          label="Confirme a senha"
          placeholder="Digite a senha novamente"
          variant="outlined"
        />
      </div>

      <div class="d-flex align-center justify-center ga-2 mb-10">
        <v-btn
          class="normalLetterSpacing flex-fill"
          color="grey-lighten-4"
          variant="flat"
          size="large"
          @click="handleCancel()"
        >
          Cancelar
        </v-btn>

        <v-btn
          :disabled="!registerFormIsValid"
          type="submit"
          class="normalLetterSpacing flex-fill"
          color="primary"
          variant="flat"
          size="large"
        >
          Continuar
        </v-btn>
      </div>

      <div class="mb-5 text-body-2">
        <div class="mb-3">
          <nuxt-link to="/auth/login">
            Já possui uma conta? Entrar
          </nuxt-link>
        </div>
      </div>

      <div class="text-caption text-disabled text-center">
        Ao se registrar na plataforma, você aceita nossas
        <nuxt-link
          to="/policies"
          class="text-decoration-underline"
        >
          Políticas e Termos
        </nuxt-link>
      </div>
    </v-form>
  </login-page-container>
</template>

<script setup lang="ts">
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, signOut, type UserCredential } from 'firebase/auth'

import { useRules } from '~/composables/commons/useRules'

import LoginPageContainer from '~/components/auth/LoginPageContainer.vue'
import { FirestoreUser, FirestoreUserPersonalData, useUsersService } from '~/composables/services/useUsersService'

import PasswordTextField from '~/components/commons/PasswordTextField.vue'

const nuxtApp = useNuxtApp()

const usersService = useUsersService()

const loadingRegister = ref(false)

const authenticatedUserCredential = ref<UserCredential>()

const registerFormIsValid = ref(false)
const fillProfileDataFormIsValid = ref(false)

const rules = useRules()

const emailRegisterFormData = ref({
  email: '',
  password: '',
  passwordConfirmation: '',
})

const userCreationPayload = ref({
  public: new FirestoreUser(),
  private: new FirestoreUserPersonalData(),
})

async function handleValidateAuthenticatedUser (userCredential: UserCredential) {
  const userAlreadyExists = await usersService.checkIfExists(userCredential.user.uid)

  if (userAlreadyExists) {
    await signOut(nuxtApp.$firebaseAuth)
    throw new Error('User already exists')
  } else {
    authenticatedUserCredential.value = userCredential
  }
}

async function handleRegisterWithGoogle () {
  try {
    loadingRegister.value = true

    const googleProvider = new GoogleAuthProvider()

    const userCredential = await signInWithPopup(nuxtApp.$firebaseAuth, googleProvider)

    await handleValidateAuthenticatedUser(userCredential)
  } catch (err) {
    console.error(err)
  } finally {
    loadingRegister.value = false
  }
}

async function handleRegisterWithEmailAndPassword () {
  try {
    loadingRegister.value = true

    const userCredential = await createUserWithEmailAndPassword(
      nuxtApp.$firebaseAuth,
      emailRegisterFormData.value.email,
      emailRegisterFormData.value.password,
    )

    await handleValidateAuthenticatedUser(userCredential)
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
    await navigateTo({ path: '/auth/login' })
  }
}
</script>
