<script setup lang="ts">
import { computed, ref, watch } from 'vue';

import type { AvatarFile } from '@/services/api';

import AccountProfileAvatarInput from '@/components/AccountProfileAvatarInput.vue';
import BaseFormWrapper from '@/components/BaseFormWrapper.vue';
import BaseAuthUserAvatarWrapper from '@/components/BaseAuthUserAvatarWrapper.vue';
import BaseLoader from '@/components/BaseLoader.vue';
import type { AvatarModelValueList } from '@/components/AccountProfileAvatarInput.vue';

const props = withDefaults(
  defineProps<{
    loading: boolean;
    avatarUploadingProgress: number;
  }>(),
  {
    loading: false,
    avatarUploadingProgress: -1,
  }
);

const emits = defineEmits({
  submit(payload: AvatarFile) {
    if (Object.values(payload).every(Boolean)) {
      return true;
    } else {
      console.warn(`Invalid submit event payload!`);
      return false;
    }
  },
  cancel: null,
});

const formIsValid = ref(false);

const avatars = ref<AvatarModelValueList>([]);

const clearAvatars = () => {
  avatars.value = [];
};

defineExpose({ clearAvatars });

watch(avatars.value, (newVal) => {
  console.log('avatars', newVal);
});

const isAvatarChanged = computed(() => Boolean(avatars.value.length));

const onSubmit = () => {
  if (props.loading) return;
  if (!formIsValid.value) return;

  if (!avatars.value.length) {
    return;
  }

  emits('submit', { avatar: avatars.value[0].file });
};

const onCancel = () => {
  emits('cancel');
};
</script>

<template>
  <BaseFormWrapper>
    <v-form v-model="formIsValid" @submit.prevent="onSubmit">
      <v-row class="mb-2">
        <template v-if="avatars.length">
          <v-col
            v-for="img in avatars"
            :key="img.previewUrl"
            class="d-flex child-flex"
            cols="12"
          >
            <v-img
              :src="img.previewUrl"
              alt="Avatar"
              cover
              class="bg-grey-lighten-2"
            >
              <template v-slot:placeholder>
                <BaseLoader />
              </template>
            </v-img>
          </v-col>
        </template>
        <v-col v-else class="d-flex child-flex" cols="12">
          <BaseAuthUserAvatarWrapper v-slot="{ url }">
            <v-img :src="url" alt="Avatar" cover class="bg-grey-lighten-2">
              <template v-slot:placeholder>
                <BaseLoader />
              </template>
            </v-img>
          </BaseAuthUserAvatarWrapper>
        </v-col>
      </v-row>

      <AccountProfileAvatarInput
        v-model="avatars"
        :progress="avatarUploadingProgress"
        :loading="loading"
      />

      <br />

      <v-btn
        :disabled="!isAvatarChanged || loading || !formIsValid"
        :loading="loading"
        block
        size="large"
        type="submit"
        variant="outlined"
      >
        Save
      </v-btn>

      <br />

      <v-btn
        :loading="loading"
        block
        size="large"
        type="button"
        variant="outlined"
        @click="onCancel"
      >
        Cancel
      </v-btn>
    </v-form>
  </BaseFormWrapper>
</template>
