<template>
    <b-container fluid>
        <b-row>
            <b-col cols="12">
                <b-row>
                    <b-col>
                        <label for="gross_annual_income">Gross Annual Income (before tax)</label>
                    </b-col>
                    <b-col>
                        {{ grossIncome.value }}
                    </b-col>
                </b-row>
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
                <b-row>
                    <b-col>
                        <label for="max_housing_expense">Max Housing Expense Percentage</label>
                    </b-col>
                    <b-col>
                        {{ maxHousingExpensePercentage.value }}
                    </b-col>
                </b-row>
                <b-form-input
                    input-id="max_housing_expense"
                    v-model="maxHousingExpensePercentage.value"
                    type="range"
                    :min="maxHousingExpensePercentage.min"
                    :max="maxHousingExpensePercentage.max"
                    :step="maxHousingExpensePercentage.step"
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
            <!-- <b-col cols="12">
                <label>Loan Amount</label>
                <b-form-input
                    disabled
                    type="text"
                    :value="loanAmount"
                ></b-form-input>
            </b-col> -->
        </b-row>
    </b-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class Loan extends Vue {
    name = 'Loan';

    grossIncome = {
        value: 72000,
        min: 0,
        max: 250000,
        step: 1000,
    };

    maxHousingExpensePercentage = {
        value: 32,
        min: 1,
        max: 100,
        step: 1,
    };

    get maxMonthlyPayment() {
        const percentage = this.maxHousingExpensePercentage.value / 100;
        return Math.ceil((percentage * this.grossIncome.value) / 12);
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
