<template>
    <b-container>
        <b-row>
            <b-col cols="6">
                <Loan />
            </b-col>
            <b-col cols="6">
                <b-row class="mb-3">
                    <img src="logo.jpeg" alt="Logo" class="logo mx-auto d-block">
                </b-row>
                <UserInfo />
            </b-col>
        </b-row>
    </b-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import UserInfo from './UserInfo.vue';
import Loan from './Loan.vue';
import emailjs from '@emailjs/browser';

// export default {
//     components: {
//         Loan,
//         UserInfo,
//     },
// }

@Component
export class FormInput extends Vue {
    components = {
        Loan,
        UserInfo,
    };
    
    name = 'FormInput';

    sendEmail(): void {

        const templateParams = {
            full_name: 'John Smith',
            loan_amount: '$100,000'
        }

        emailjs.send(
            process.env.VUE_APP_SERVICE_ID,
            process.env.VUE_APP_EMAIL_TEMPLATE,
            templateParams,
            process.env.VUE_APP_EMAILJS_API_KEY
        );
    }
};
</script>

<style lang="scss">
.logo {
    height: 250px;
}
</style>
