<template>
    <b-container class="h-100" style="padding-top: 10vh;">
        <b-row class="mb-4">
            <b-col class="text-left font-weight-bold montserrat"
                style="font-size:40px; color: #000">
                Home<br>
                Affordability<br>
                Calculator<br>
            </b-col>
            <b-col cols="6">
                <img src="logo.webp" alt="Logo" class="logo mx-auto d-block">
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
                            class="form-control-ld"
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
                            class="form-control-lg"
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
                            size="lg"
                            v-bind:style="{'font-size': '20px;'}"
                            type="range"
                            :min="availableFunds.min"
                            :max="availableFunds.max"
                            :step="availableFunds.step"
                        ></b-form-input>
                    </b-col>
                    <b-col cols="12" class="mb-3">
                        <label>Max PI Payment <small>(monthly estimate)</small></label>
                        <span
                            class="font-weight-bold float-right"
                            v-html="formatCurrency(monthlyPIPayment)"
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
                        <label>Max Monthly Payment <small>(based on income)</small></label>
                        <span
                            class="font-weight-bold float-right"
                            v-html="formatCurrency(maxMonthlyPayment)"
                        />
                    </b-col>
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
                                input-id="phone-number-input"
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
                        <b-col cols="12" class="mb-5">
                            <label>Loan Officer</label>
                            <b-form-select
                                v-model="selectedLoanOfficer"
                                :options="loanOfficers">
                            </b-form-select>
                        </b-col>
                        <b-col cols="12">
                            <b-button
                                variant="success"
                                class="w-100"
                                @click="sendEmail"
                                :disabled="!validForm"
                            >
                                Email my Estimate
                            </b-button>
                        </b-col>
                    </b-row>
                </b-container>
            </b-col>
        </b-row>
        <b-modal
            v-model="emailSending"
            class="text-center"
            centered
            hide-footer
            hide-header
        >
            <h2 class="p5 text-center mb-4" style="margin: 50px;">
                Thank You<br><br>
                Your estimate is in your inbox!</h2>
                <div class="w-100 text-center">
                    <b-button
                        @click="resetForm()"
                        class="w-75 mb-5"
                    >
                        Close
                    </b-button>
                </div>
        </b-modal>
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
    emailSending = false;
    selectedLoanOfficer = '';

    loanOfficers = [
        { value: 'Nicholas Lassiter', text: 'Nicholas Lassiter' },
        { value: 'Colby Brackeen', text: 'Colby Brackeen' },
        { value: 'Lisa Marie', text: 'Lisa Marie' },
        { value: 'Anabella Ruiz', text: 'Anabella Ruiz' },
        { value: 'John Smutny', text: 'John Smutny' },
        { value: 'Matthew Medrano', text: 'Matthew Medrano' },
        { value: 'Ramona Chapman', text: 'Ramona Chapman' },
        { value: 'Justin Rocheleau', text: 'Justin Rocheleau' },
        { value: 'Viridiana De Leon', text: 'Viridiana De Leon' },
    ];

    grossIncome = {
        value: 72000,
        min: 0,
        max: 250000,
        step: 1000,
    };

    totalMonthlyDebtPayments = {
        value: 500,
        min: 0,
        max: 15000,
        step: 10,
    };

    availableFunds = {
        value: 20000,
        min: 0,
        max: 200000,
        step: 1000,
    };

    sendEmail(): void {
        this.emailSending = true;

        const templateParams = {
            from_name: this.fullName,
            phone: this.phone,
            contact_email: this.email,
            loan_estimate: this.formatCurrency(this.homePrice),
            income: this.formatCurrency(this.grossIncome.value),
            monthly_debt: this.formatCurrency(this.totalMonthlyDebtPayments.value),
            available_funds: this.formatCurrency(this.availableFunds.value),
            max_pi_payment: this.formatCurrency(this.monthlyPIPayment),
            property_tax: this.formatCurrency(this.monthlyPropertyTax),
            home_owners_insurance: this.formatCurrency(this.monthlyHomeInsurance),
            max_monthly_payment: this.formatCurrency(this.maxMonthlyPayment),
            selected_loan_officer: this.selectedLoanOfficer,
        };

        // Send to JR Mortgage
        emailjs.send(
            process.env.VUE_APP_SERVICE_ID,
            process.env.VUE_APP_JR_MORTGAGE_TEMPLATE,
            templateParams,
            process.env.VUE_APP_EMAILJS_PUBLIC_KEY,
        );

        const userParams = {
            user_email: this.email,
            loan_estimate: this.formatCurrency(this.homePrice),
            loan_officer_link: this.loanOfficerLink(this.selectedLoanOfficer),
        };
        // Send to user
        emailjs.send(
            process.env.VUE_APP_SERVICE_ID,
            process.env.VUE_APP_USER_EMAIL_TEMPLATE,
            userParams,
            process.env.VUE_APP_EMAILJS_PUBLIC_KEY,
        );
    }

    resetForm() {
        // eslint-disable-next-line
        location.reload();
    }

    formatCurrency(number: number) {
        return numeral(number).format('($0,0)');
    }

    loanOfficerLink(name: string) {
        if (name === 'Nicholas Lassiter') return 'https://jrmg.my1003app.com/2399487/register';
        if (name === 'Colby Brackeen') return 'https://jrmg.my1003app.com/2058048/register';
        if (name === 'Lisa Marie') return 'https://jrmg.my1003app.com/2302146/register';
        if (name === 'Anabella Ruiz') return 'https://jrmg.my1003app.com/2411758/register';
        if (name === 'John Smutny') return 'https://jrmg.my1003app.com/2321844/register';
        if (name === 'Matthew Medrano') return 'https://jrmg.my1003app.com/2278259/register';
        if (name === 'Ramona Chapman') return 'https://jrmg.my1003app.com/1753891/register';
        if (name === 'Justin Rocheleau') return 'https://jrmg.my1003app.com/1804953/register';
        if (name === 'Viridiana De Leon') return 'https://jrmg.my1003app.com/1804953/register'; // Use Justin's for now
        return 'https://jrmortgagegroup.com/information';
    }

    get validForm() {
        if (this.fullName.length < 2) return false;
        if (this.phone.length < 10) return false;
        if (this.email.length < 5) return false;
        if (this.selectedLoanOfficer.length < 1) return false;
        return true;
    }

    get maxMonthlyPayment() {
        const result = this.maxMonthlyPaymentBasedOnDebtToIncomeRatio
            < this.maxMonthlyPaymentBasedOnIncome
            ? this.maxMonthlyPaymentBasedOnDebtToIncomeRatio : this.maxMonthlyPaymentBasedOnIncome;
        console.log(result);
        return result;
    }

    get monthlyPropertyTax() {
        const percentage = process.env.VUE_APP_PROPERTY_TAX_PERCENTAGE / 100;
        return percentage * this.maxMonthlyPayment;
    }

    get monthlyHomeInsurance() {
        const percentage = process.env.VUE_APP_HOME_INSURANCE_PERCENTAGE / 100;
        return percentage * this.maxMonthlyPayment;
    }

    get maxMonthlyPaymentBasedOnIncome() {
        const rate = process.env.VUE_APP_MAX_HOUSING_EXPENSE / 100;
        const result = (this.grossIncome.value * rate) / 12;
        return result;
    }

    get maxMonthlyPaymentBasedOnDebtToIncomeRatio() {
        const monthlyIncome = this.grossIncome.value / 12;
        const debtToIncomeRatio = process.env.VUE_APP_DEBT_TO_INCOME_RATIO / 100;
        return (monthlyIncome * debtToIncomeRatio) - this.totalMonthlyDebtPayments.value;
    }

    get monthlyPIPaymentBasedOnExpenses() {
        return ((this.maxMonthlyPayment - this.monthlyPropertyTax) - this.monthlyHomeInsurance);
    }

    get monthlyPIPaymentBasedOnFunds() {
        const presentValue = (0 - this.maxHomePriceBasedOnFunds)
            * (1 - (process.env.VUE_APP_MINIMUM_DOWN_PAYMENT / 100));
        const months = process.env.VUE_APP_YEARS_OF_MORTGAGE * 12;
        const rate = (process.env.VUE_APP_ANNUAL_INTEREST_RATE_PERCENTAGE / 100) / 12;
        const pmt = 0 - (presentValue * rate) / (1 - (1 + rate) ** (0 - months));
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
        return result;
    }

    get downPaymentBasedOnFunds() {
        const closingCosts = process.env.VUE_APP_FIXED_CLOSING_COSTS;
        const money = this.availableFunds.value - closingCosts;
        const rate = process.env.VUE_APP_CLOSIING_COSTS_PERCENTAGE / 100;
        const result = (money - (rate * this.loanAmount)) / (1 + rate);
        return result;
    }

    get loanAmount() {
        const rate = process.env.VUE_APP_ANNUAL_INTEREST_RATE_PERCENTAGE;
        const numberOfPayments = process.env.VUE_APP_YEARS_OF_MORTGAGE * 12;
        const result = this.presentValue(this.monthlyPIPayment, rate, numberOfPayments);
        console.log('loan amount: ', result);
        return result;
    }

    get homePrice() {
        const result = this.loanAmount + this.downPaymentBasedOnFunds;
        console.log('home price: ', result);
        return Math.floor(result);
    }

    calculateRatePerPeriod(interestRate: number): number {
        return interestRate / 100 / 12;
    }

    presentValue(monthlyPayment: number, interestRate: number, months: number): number {
        const ratePerPeriod = this.calculateRatePerPeriod(interestRate);
        return monthlyPayment * ((1 - (1 + ratePerPeriod) ** -months) / ratePerPeriod);
    }

    mounted() {
        const input = document.querySelector("input[input-id='phone-number-input']");

        input?.addEventListener('input', (event) => {
            const target = event.target as HTMLInputElement;
            // Get the input value
            let inputValue = target.value;

            // Remove any non-numeric characters
            inputValue = inputValue.replace(/\D/g, '');

            // Format the input as a phone number
            inputValue = `${inputValue.substr(0, 3)}-${inputValue.substr(3, 3)}-${inputValue.substr(6, 4)}`;

            // Update the input value
            target.value = inputValue;
        });
    }
}
</script>

<style lang="scss">
.logo {
    height: 250px;
}
</style>
