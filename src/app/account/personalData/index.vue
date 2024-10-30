<template>
  <div class="pageContainer">
    <div class="d-flex align-center mb-8">
      <v-btn
        icon="mdi-chevron-left"
        variant="tonal"
        class="mr-5"
        @click="$router.push('/account')"
      />

      <h1 class="text-h5 font-weight-bold">
        Dados pessoais
      </h1>
    </div>

    <v-list>
      <personal-data-item
        v-for="(personalDataItem, personalDataItemIndex) in items"
        :key="`personalDataItem${personalDataItemIndex}`"
        :item="personalDataItem"
      />

      <v-list-item>
        <template #title>
          Foto de perfil
        </template>

        <template #subtitle>
          Clique na foto para alterar
        </template>

        <template #append>
          <v-progress-circular
            v-if="loadingUpdateProfilePhoto"
            size="24"
            width="2"
            color="black"
            class="ma-3"
            indeterminate
          />

          <v-hover v-else>
            <template #default="{ props: hoverProps, isHovering }">
              <user-avatar
                :key="`isLoading`"
                :src="accountStore.firestoreUserData?.imageUrl"
                :size="50"
                class="cursor-pointer"
                v-bind="hoverProps"
                @click="selectFile((newFile) => handleUpdateProfilePhoto(newFile))"
              >
                <v-overlay
                  :model-value="!!isHovering"
                  :opacity="0.8"
                  class="d-flex align-center justify-center"
                  contained
                  z-index="1"
                >
                  <v-icon
                    color="white"
                  >
                    mdi-upload
                  </v-icon>
                </v-overlay>
              </user-avatar>
            </template>
          </v-hover>
        </template>
      </v-list-item>

      <v-divider class="my-3" />
    </v-list>

    <remove-my-account-dialog
      v-if="accountStore.firestoreUserData"
      :user-data="accountStore.firestoreUserData"
    >
      <template #activator="{ props: activatorProps }">
        <v-btn
          color="error"
          class="normalLetterSpacing"
          variant="flat"
          size="large"
          block
          v-bind="activatorProps"
        >
          Excluir minha conta
        </v-btn>
      </template>
    </remove-my-account-dialog>
  </div>
</template>

<script setup lang="ts">
import PersonalDataItem from './components/PersonalDataItem.vue'
import RemoveMyAccountDialog from './components/RemoveMyAccountDialog.vue'

import UserAvatar from '~/components/commons/UserAvatar.vue'

import { useAccountStore } from '~/store/account'
import { useSnackbarStore } from '~/store/snackbar'

import { useUsersService } from '~/composables/services/useUsersService'

import { selectFile } from '~/utils'

const accountStore = useAccountStore()
const snackbarStore = useSnackbarStore()

const usersService = useUsersService()

const loadingUpdateProfilePhoto = ref(false)

const items = computed(() => [
  {
    title: 'Nome',
    value: accountStore.firestoreUserData?.displayName,
    allowEdition: true,
    update: updateDisplayName,
  },
  {
    title: 'Cargo',
    value: accountStore.firestoreUserData?.position,
    allowEdition: false,
  },
  {
    title: 'E-mail',
    value: accountStore.firestoreUserPrivateData?.email,
    allowEdition: false,
  },
])

async function updateDisplayName (newValue: string) {
  try {
    let firestoreUserData = accountStore.firestoreUserData
    const authUserData = accountStore.authUserData

    if (firestoreUserData && authUserData) {
      firestoreUserData = {
        ...firestoreUserData,
        displayName: newValue,
      }

      await usersService.update(authUserData.uid, firestoreUserData)

      accountStore.setFirestoreUserData(firestoreUserData)
    }
  } catch (err) {
    console.error(err)
  }
}

async function handleUpdateProfilePhoto (file: File) {
  try {
    if (!accountStore.authUserData || !accountStore.firestoreUserData) {
      throw new Error('Unauthenticated')
    }

    loadingUpdateProfilePhoto.value = true

    const updatedUser = await usersService.update(
      accountStore.authUserData.uid,
      accountStore.firestoreUserData,
      file,
    )

    accountStore.setFirestoreUserData(updatedUser)
  } catch (err) {
    console.error(err)
    snackbarStore.showErrorSnackbar()
  } finally {
    loadingUpdateProfilePhoto.value = false
  }
}
</script>
