<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useMutation } from '@tanstack/vue-query';
import { storeToRefs } from 'pinia';

import router, { AppRouteNames } from '@/router';
import { useAuthStore } from '@/stores/auth';

import { buyThirtyCoins } from '@/services/coins';
import type { BuyThirtyCoinsPayload } from '@/services/api';

import BaseFormWrapper from '@/components/BaseFormWrapper.vue';
import BaseInputWrapper from '@/components/BaseInputWrapper.vue';

const { authUser } = storeToRefs(useAuthStore());

const creditCardData = reactive<BuyThirtyCoinsPayload>({
  number: 0,
  month: 0,
  year: 0,
  cvv: 0,
});

const formIsValid = ref(false);

const buyThirtyCoinsMutation = useMutation({
  // mutationKey: [],
  mutationFn: () => buyThirtyCoins(creditCardData),
  onSuccess: (response) => {
    console.log(response.data.coins);
    router.push({ name: AppRouteNames.accountProfile });
  },
});
</script>

<template>
  <div class="d-flex flex-column">
    <BaseFormWrapper v-if="authUser">
      <v-form
        v-model="formIsValid"
        @submit.prevent="buyThirtyCoinsMutation.mutate"
      >
        <v-row dense>
          <v-col>
            <BaseInputWrapper v-slot="{ inputProps }">
              <v-text-field
                v-bind="inputProps"
                v-model.number="creditCardData.number"
                :readonly="buyThirtyCoinsMutation.isLoading.value"
                :rules="[]"
                label="Card number"
                type="number"
              ></v-text-field>
              <!-- autocomplete="card-number" -->
            </BaseInputWrapper>
            <BaseInputWrapper v-slot="{ inputProps }">
              <v-text-field
                v-bind="inputProps"
                v-model.number="creditCardData.month"
                :readonly="buyThirtyCoinsMutation.isLoading.value"
                :rules="[]"
                label="Month"
                type="number"
              ></v-text-field>
              <!-- autocomplete="card-number" -->
            </BaseInputWrapper>
            <BaseInputWrapper v-slot="{ inputProps }">
              <v-text-field
                v-bind="inputProps"
                v-model.number="creditCardData.year"
                :readonly="buyThirtyCoinsMutation.isLoading.value"
                :rules="[]"
                label="Year"
                type="number"
              ></v-text-field>
              <!-- autocomplete="card-number" -->
            </BaseInputWrapper>
            <BaseInputWrapper v-slot="{ inputProps }">
              <v-text-field
                v-bind="inputProps"
                v-model.number="creditCardData.cvv"
                :readonly="buyThirtyCoinsMutation.isLoading.value"
                :rules="[]"
                label="CVV"
                type="number"
              ></v-text-field>
              <!-- autocomplete="card-number" -->
            </BaseInputWrapper>

            <div>
              <v-btn
                :disabled="buyThirtyCoinsMutation.isLoading.value"
                :loading="buyThirtyCoinsMutation.isLoading.value"
                block
                size="large"
                type="submit"
                variant="outlined"
              >
                Buy
              </v-btn>

              <br />

              <v-btn
                :loading="buyThirtyCoinsMutation.isLoading.value"
                block
                size="large"
                type="button"
                variant="outlined"
                :to="{ name: AppRouteNames.accountProfile }"
              >
                Cancel
              </v-btn>
            </div>
          </v-col>
        </v-row>
      </v-form>
    </BaseFormWrapper>
  </div>
</template>

<style></style>
