<template>
    <b-container style="padding-top: 10vh;" fluid>
        <b-row class="mb-4">
            <b-col class="text-left font-weight-bold" style="font-size:40px;">
                Home Loan<br>
                Affordability<br>
                Estimate<br>
            </b-col>
            <b-col cols="6">
                <img src="logo.jpeg" alt="Logo" class="logo mx-auto d-block">
            </b-col>
        </b-row>
        <b-row>
            <b-col cols="6">
                <b-row>
                    <b-col cols="12" class="mb-3">
                        <label
                            for="gross_annual_income"
                            class="float-left"
                            v-html="'Gross Annual Income (before tax)'"
                        />
                        <span
                            class="float-right font-weight-bold"
                            v-html="formatCurrency(grossIncome.value)"
                        />
                        <b-form-input
                            input-id="gross_annual_income"
                            v-model="grossIncome.value"
                            type="range"
                            :min="grossIncome.min"
                            :max="grossIncome.max"
                            :step="grossIncome.step"
                        ></b-form-input>
                    </b-col>
                    <b-col cols="12" class="mb-3">
                        <label
                            for="available_funds"
                            class="float-left"
                            v-html="'Total Debt Payments (monthly)'"
                        />
                        <span
                            class="float-right font-weight-bold"
                            v-html="formatCurrency(totalMonthlyDebtPayments.value)"
                        />
                        <b-form-input
                            input-id="available_funds"
                            v-model="totalMonthlyDebtPayments.value"
                            type="range"
                            :min="totalMonthlyDebtPayments.min"
                            :max="totalMonthlyDebtPayments.max"
                            :step="totalMonthlyDebtPayments.step"
                        ></b-form-input>
                    </b-col>
                    <b-col cols="12" class="mb-5">
                        <label
                            for="max_housing_expense"
                            class="float-left"
                            v-html="'Available Funds'"
                        />
                        <span
                            class="float-right font-weight-bold"
                            v-html="formatCurrency(availableFunds.value)"
                        />
                        <b-form-input
                            input-id="max_housing_expense"
                            v-model="availableFunds.value"
                            type="range"
                            :min="availableFunds.min"
                            :max="availableFunds.max"
                            :step="availableFunds.step"
                        ></b-form-input>
                    </b-col>
                    <b-col cols="12" class="mb-3">
                        <label>Max Monthly Payment <small>(based on income)</small></label>
                        <span
                            class="font-weight-bold float-right"
                            v-html="formatCurrency(maxMonthlyPayment)"
                        />
                    </b-col>
                    <b-col cols="12" class="mb-3">
                        <label>Property Tax <small>(monthly estimate)</small></label>
                        <span
                            class="font-weight-bold float-right"
                            v-html="formatCurrency(monthlyPropertyTax)"
                        />
                    </b-col>
                    <b-col cols="12" class="mb-3">
                        <label>Home Owner's Insurance <small>(monthly estimate)</small></label>
                        <span
                            class="font-weight-bold float-right"
                            v-html="formatCurrency(monthlyHomeInsurance)"
                        />
                    </b-col>
                    <b-col cols="12" class="mb-3">
                        <label>Max PI Payment <small>(monthly estimate)</small></label>
                        <span
                            class="font-weight-bold float-right"
                            v-html="formatCurrency(monthlyPIPayment)"
                        />
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
            </b-col>
            <b-col cols="6">
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
                            <label>Phone</label>
                            <b-form-input
                                input-id="phone"
                                v-model="phone"
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

    phone = '';

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
        max: 2000,
        step: 10,
    };

    availableFunds = {
        value: 20000,
        min: 0,
        max: 100000,
        step: 1000,
    };

    formatCurrency(number: number) {
        return numeral(number).format('($0,0)');
    }

    get maxMonthlyPayment() {
        const monthlyIncome = this.grossIncome.value / 12;
        const debtToIncomeRatio = process.env.VUE_APP_DEBT_TO_INCOME_RATIO / 100;
        return Math.ceil((monthlyIncome * debtToIncomeRatio) - this.totalMonthlyDebtPayments.value);
    }

    get monthlyPropertyTax() {
        const percentage = process.env.VUE_APP_PROPERTY_TAX_PERCENTAGE / 100;
        return Math.ceil(percentage * this.maxMonthlyPayment);
    }

    get monthlyHomeInsurance() {
        const percentage = process.env.VUE_APP_HOME_INSURANCE_PERCENTAGE / 100;
        return Math.ceil(percentage * this.maxMonthlyPayment);
    }

    get monthlyPIPaymentBasedOnExpenses() {
        return ((this.maxMonthlyPayment - this.monthlyPropertyTax) - this.monthlyHomeInsurance);
    }

    get monthlyPIPaymentBasedOnFunds() {
        const presentValue = (0 - this.maxHomePriceBasedOnFunds)
            * (1 - (process.env.VUE_APP_MINIMUM_DOWN_PAYMENT / 100));
        const months = process.env.VUE_APP_YEARS_OF_MORTGAGE * 12;
        const rate = (process.env.VUE_APP_ANNUAL_INTEREST_RATE_PERCENTAGE / 100) / 12;
        console.log(presentValue);
        console.log(months);
        console.log(rate);
        const pmt = 0 - (presentValue * rate) / (1 - (1 + rate) ** (0 - months));
        console.log(`pmt: ${pmt}`);
        return pmt;
    }

    get monthlyPIPayment() {
        return this.monthlyPIPaymentBasedOnExpenses < this.monthlyPIPaymentBasedOnFunds
            ? this.monthlyPIPaymentBasedOnExpenses : this.monthlyPIPaymentBasedOnFunds;
    }

    get maxHomePriceBasedOnFunds() {
        const funds = this.availableFunds.value - process.env.VUE_APP_FIXED_CLOSING_COSTS;
        const percentageRemoved = parseInt(process.env.VUE_APP_MINIMUM_DOWN_PAYMENT, 10)
            + parseInt(process.env.VUE_APP_CLOSIING_COSTS_PERCENTAGE, 10);
        const result = funds / (percentageRemoved / 100);
        console.log(`Max Price Funds: ${result}`, funds, percentageRemoved);
        return result;
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
