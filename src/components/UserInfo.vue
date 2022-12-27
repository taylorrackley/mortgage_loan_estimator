<template>
    <b-container fluid>
        <b-row>
            <b-col cols="12" class="mb-4">
                <label>Full Name</label>
                <b-form-input
                    input-id="full_name"
                    v-model="fullName"
                    type="text"
                ></b-form-input>
            </b-col>
            <b-col cols="12" class="mb-4">
                <label>Email</label>
                <b-form-input
                    input-id="email"
                    v-model="email"
                    type="email"
                ></b-form-input>
            </b-col>
            <b-col cols="12">
                <b-button variant="success" class="w-100">Email my Estimate</b-button>
            </b-col>
        </b-row>
    </b-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class UserInfo extends Vue {
    name = 'UserInfo';

    fullName = '';

    email = '';
}
</script>
