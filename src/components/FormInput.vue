<template>
    <b-container style="padding-top: 150px;" fluid>
        <b-row>
            <b-col cols="6">
                <b-container fluid>
                    <b-row>
                        <b-col cols="12">
                            <label for="gross_annual_income" class="float-left">
                                Gross Annual Income (before tax)</label>
                            <span class="float-right font-weight-bold">
                                {{ incomeFormatted }} </span>
                            <b-form-input
                                input-id="gross_annual_income"
                                v-model="grossIncome.value"
                                type="range"
                                :min="grossIncome.min"
                                :max="grossIncome.max"
                                :step="grossIncome.step"
                            ></b-form-input>
                        </b-col>
                        <b-col cols="12">
                            <label for="max_housing_expense" class="float-left">
                                Total Debt Payments (monthly)</label>
                            <span class="float-right font-weight-bold">
                                {{ totalMonthlyDebtPayments.value }}</span>
                            <b-form-input
                                input-id="max_housing_expense"
                                v-model="totalMonthlyDebtPayments.value"
                                type="range"
                                :min="totalMonthlyDebtPayments.min"
                                :max="totalMonthlyDebtPayments.max"
                                :step="totalMonthlyDebtPayments.step"
                            ></b-form-input>
                        </b-col>
                        <b-col cols="12">
                            <label>Max Monthly Payment (based on income)</label>
                            <b-form-input
                                disabled
                                type="text"
                                :value="maxMonthlyPayment"
                            ></b-form-input>
                        </b-col>
                        <b-col cols="12">
                            <label>Property Tax (monthly estimate)</label>
                            <b-form-input
                                disabled
                                type="text"
                                :value="monthlyPropertyTax"
                            ></b-form-input>
                        </b-col>
                        <b-col cols="12">
                            <label>Home Owner's Insurance (monthly estimate)</label>
                            <b-form-input
                                disabled
                                type="text"
                                :value="monthlyHomeInsurance"
                            ></b-form-input>
                        </b-col>
                        <b-col cols="12">
                            <label>Max PI Payment (monthly estimate)</label>
                            <b-form-input
                                disabled
                                type="text"
                                :value="monthlyPIPayment"
                            ></b-form-input>
                        </b-col>
                        <b-col cols="12">
                            <label>Loan Amount</label>
                            <b-form-input
                                disabled
                                type="text"
                                :value="loanAmount"
                            ></b-form-input>
                        </b-col>
                    </b-row>
                </b-container>
            </b-col>
            <b-col cols="6">
                <b-row class="mb-3">
                    <img src="logo.jpeg" alt="Logo" class="logo mx-auto d-block">
                </b-row>
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
            </b-col>
        </b-row>
    </b-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import emailjs from '@emailjs/browser';
import numeral from 'numeral';

@Component
export default class FormInput extends Vue {
    name = 'FormInput';

    fullName = '';

    email = '';

    sendEmail(): void {
        const templateParams = {
            full_name: 'John Smith',
            loan_amount: '$100,000',
        };

        emailjs.send(
            process.env.VUE_APP_SERVICE_ID,
            process.env.VUE_APP_EMAIL_TEMPLATE,
            templateParams,
            process.env.VUE_APP_EMAILJS_API_KEY,
        );
    }

    grossIncome = {
        value: 72000,
        min: 0,
        max: 250000,
        step: 1000,
    };

    totalMonthlyDebtPayments = {
        value: 500,
        min: 0,
        max: 10000,
        step: 10,
    };

    get incomeFormatted() {
        return numeral(this.grossIncome.value).format('($0,0)');
    }

    get maxMonthlyPayment() {
        const monthlyIncome = this.grossIncome.value / 12;
        const debtToIncomeRatio = process.env.VUE_APP_DEBT_TO_INCOME_RATIO / 100;
        return Math.ceil((monthlyIncome * debtToIncomeRatio) - this.totalMonthlyDebtPayments.value);
    }

    get monthlyPropertyTax() {
        const percentage = process.env.VUE_APP_PROPERTY_TEXT_PERCENTAGE / 100;
        return Math.ceil(percentage * this.maxMonthlyPayment);
    }

    get monthlyHomeInsurance() {
        const percentage = process.env.VUE_APP_HOME_INSURANCE_PERCENTAGE / 100;
        return Math.ceil(percentage * this.maxMonthlyPayment);
    }

    get monthlyPIPayment() {
        return ((this.maxMonthlyPayment - this.monthlyPropertyTax) - this.monthlyHomeInsurance);
    }

    get loanAmount() {
        const rate = process.env.VUE_APP_ANNUAL_INTEREST_RATE_PERCENTAGE;
        const numberOfPayments = process.env.VUE_APP_YEARS_OF_MORTGAGE * 12;
        return this.presentValue(this.monthlyPIPayment, rate, numberOfPayments);
    }

    calculateRatePerPeriod(interestRate: number): number {
        return interestRate / 100 / 12;
    }

    presentValue(monthlyPayment: number, interestRate: number, months: number): number {
        const ratePerPeriod = this.calculateRatePerPeriod(interestRate);
        return Math.floor(monthlyPayment * ((1 - (1 + ratePerPeriod) ** -months) / ratePerPeriod));
    }
}
</script>

<style lang="scss">
.logo {
    height: 250px;
}
</style>
