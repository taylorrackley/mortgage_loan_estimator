<template>
    <b-container fluid>
        <b-col cols="6">
            <b-row>
                <b-col cols="12">
                    <b-row>
                        <b-col>
                            <label for="gross_annual_income"
                                >Gross Annual Income (before tax)</label
                            >
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
                            <label for="max_housing_expense"
                                >Max Housing Expense Percentage</label
                            >
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
            </b-row>
        </b-col>
    </b-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class Form extends Vue {
    grossIncome = {
        value: 0,
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
        return process.env.PROPERTY_TEXT_PERCENTAGE * this.maxMonthlyPayment;
    }

    get monthlyHomeInsurance() {
        return process.env.HOME_INSURANCE_PERCENTAGE * this.maxMonthlyPayment;
    }

    get monthlyPIPayment() {
        return (
            this.maxMonthlyPayment -
            this.monthlyPropertyTax -
            this.monthlyHomeInsurance
        );
    }

    loanAmount() {
        const rate = process.env.ANNUAL_INTEREST_RATE_PERCENTAGE / 12;
        const numberOfPayments = process.env.YEARS_OF_MORTGAGE * 12;

        return (1 - (1 + rate) ** -numberOfPayments) / rate;
    }
}
</script>
