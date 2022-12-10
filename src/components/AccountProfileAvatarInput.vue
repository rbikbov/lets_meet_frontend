<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue';

import BaseInputWrapper from '@/components/BaseInputWrapper.vue';

export type AvatarModelValueItem = {
  previewUrl: string;
  file: File;
};

export type AvatarModelValueList = AvatarModelValueItem[];

const props = withDefaults(
  defineProps<{
    loading: boolean;
    progress?: number;
    modelValue: AvatarModelValueList;
  }>(),
  {
    loading: false,
    progress: 0,
    modelValue: () => [],
  }
);

const emits = defineEmits({
  'update:modelValue'(payload: AvatarModelValueList) {
    // TODO: payload validation
    return true;
  },
});

const avatarFiles = ref<File[]>([]);

watch(
  () => props.modelValue,
  (val) => {
    // avoid recursive updates
    const newFiles = val.map((v) => v.file);
    if (
      newFiles.length === avatarFiles.value.length &&
      newFiles.every((f, i) => f === avatarFiles.value[i])
    ) {
      return;
    }
    avatarFiles.value = newFiles;
  },
  {
    immediate: true,
    deep: true,
  }
);

const newAvatarPreviewUrls = computed(() => {
  if (!avatarFiles.value || !avatarFiles.value.length) return [];

  return avatarFiles.value.map(URL.createObjectURL);
});

const revokePreviewAvatarUrl = (url: string) => {
  if (!url) return;
  URL.revokeObjectURL(url);
  console.log(`URL.revokeObjectURL(${url});`);
};

watch(newAvatarPreviewUrls, (val, oldVal) => {
  oldVal.forEach(revokePreviewAvatarUrl);
  emits(
    'update:modelValue',
    val.map((url, index) => ({
      previewUrl: url,
      file: avatarFiles.value![index],
    }))
  );
});

onBeforeUnmount(() => {
  newAvatarPreviewUrls.value.forEach(revokePreviewAvatarUrl);
});

const rules = [
  (value: HTMLInputElement['files']) => {
    return (
      !value ||
      !value.length ||
      value[0].size < 2000000 ||
      'Avatar size should be less than 2 MB!'
    );
  },
];
</script>

<template>
  <BaseInputWrapper v-slot="{ inputProps }">
    <v-file-input
      v-bind="inputProps"
      v-model="avatarFiles"
      accept="image/*"
      prepend-icon=""
      placeholder="Pick a new avatar"
      label="Pick a new avatar"
      clearable
      show-size
      :rules="rules"
      :disabled="loading"
    >
      <template v-slot:prepend-inner>
        <v-progress-circular v-if="loading" :model-value="progress" :size="24">
          <!-- <span>{{ progress }}</span> -->
        </v-progress-circular>
        <v-icon v-else icon="mdi-camera" />
      </template>
      <template v-slot:selection="{ fileNames }">
        <template v-if="fileNames && fileNames.length">
          <template v-for="fileName in fileNames" :key="fileName">
            <v-chip size="small" label color="primary" class="mr-2">
              {{ fileName }}
            </v-chip>
          </template>
        </template>
        <!--
          <template v-else>
            <v-chip size="small" label color="primary" class="mr-2">
              {{ fileName }}
            </v-chip>
          </template>
          -->
      </template>
      <template v-slot:loader>
        <v-progress-linear
          :active="loading"
          :model-value="progress"
          absolute
          height="5"
          indeterminate
        ></v-progress-linear>
      </template>
    </v-file-input>
  </BaseInputWrapper>
</template>
