<template>
  <div v-if="!pastDayNotFinished && !todayIsFinished">
    <form @submit.prevent="submitEntry">
      <div v-if="message" class="p-3 bg-gray-200 rounded my-4">
        <p>{{ message }}</p>
      </div>
      <div class="flex flex-row space-x-2">
        <label class="flex-1 mb-4">
          <span class="text-gray-700">Nume de familie</span>
          <input class="form-input mt-1 block w-full" placeholder="Morar" required v-model="lastName">
        </label>
        <label class="flex-1 mb-4">
          <span class="text-gray-700">Prenume</span>
          <input class="form-input mt-1 block w-full" placeholder="Gabriel" required v-model="firstName">
        </label>
      </div>
      <button type="submit" class="form-button" :disabled="disabled">
        {{ buttonMessages[buttonType] }}
      </button>
    </form>
  </div>
  <div v-else-if="pastDayNotFinished">
    <div class="p-3 rounded border border-orange-300 bg-orange-200 text-orange-800">
      <p><strong>Nu ai încheiat ziua anterioară de lucru!</strong> Resetează formularul pentru a putea continua.</p>
      <button @click="deleteLocalData" class="h-12 mt-4 font-bold underline">
        Apasă aici pentru a reseta
      </button>
    </div>
  </div>
  <div v-else-if="todayIsFinished">
    <p>Ai încheiat ziua de azi.</p>
  </div>
</template>

<script>
import ky from 'ky'

export default {
  name: 'Form',

  data() {
    return {
      lastName: null,
      firstName: null,
      entryType: 'start',
      buttonType: 'start',
      pastDayNotFinished: false,
      todayIsFinished: false,
      disabled: false,
      lateTime: null,
      message: null,

      entryTypes: {
        start: 'Venire',
        end: 'Plecare'
      },
      buttonMessages: {
        start: 'Începe ziua',
        end: 'Încheie ziua',
        error: 'A apărut o eroare!'
      },
    }
  },

  mounted() {
    this.initializeForm()
    this.buttonType = this.entryType
  },

  methods: {
    initializeForm () {
      this.lastName = window.localStorage.getItem('lastName')
      this.firstName = window.localStorage.getItem('firstName')

      const today = new Date().setHours(0, 0, 0, 0)

      const started = window.localStorage.getItem('start')
      const ended = window.localStorage.getItem('end')

      const startedDate = new Date(started).setHours(0, 0, 0, 0)
      const endedDate = new Date(ended).setHours(0, 0, 0, 0)
      console.log(started)

      if (started && ended && today === endedDate) {
        console.log('Day is finished.')
        return this.todayIsFinished = true
      }
      if (started && ended && startedDate === endedDate) {
        console.log('Starting new day.')
        window.localStorage.setItem('start', null)
        window.localStorage.setItem('end', null)
        return
      }
      if (started && !ended && today !== startedDate) {
        console.log('Past day not finished.')
        this.lateDate = new Date(startedDate)
        this.entryType = 'end'
        return this.pastDayNotFinished = true
      }
      if (started && today === startedDate) {
        console.log('Ending day.')
        return this.entryType = 'end'
      }
    },

    async submitEntry () {
      const formUrl = 'https://docs.google.com/forms/u/0/d/e/1FAIpQLSd-J36jV7dLQLzjM8wD8sMhEGvlfIaurhzNk1EIoc5S2rN_JQ/formResponse'
      const { formdata, datetime } = this.getFormData()

      try {
        const response = await ky.post(formUrl, { body: formdata })
      } catch (err) {
        this.buttonType[this.buttonMessages.error]
      }
      window.localStorage.setItem(this.entryType, datetime)
      window.localStorage.setItem('firstName', this.firstName)
      window.localStorage.setItem('lastName', this.lastName)

      if(this.entryType === 'start') {
        this.message = 'Revino la sfârșitul zilei.'
      } else {
        this.message = 'Revino în următoarea zi de lucru.'
      }
      this.disabled = true
    },

    getFormData () {
      const datetime = new Date()
      const formdata = new FormData()
      formdata.append('entry.1601154700_minute', datetime.getMinutes())
      formdata.append('entry.1601154700_hour', datetime.getHours())
      formdata.append('entry.1601154700_day', datetime.getDate())
      formdata.append('entry.1601154700_month', datetime.getMonth())
      formdata.append('entry.1601154700_year', datetime.getFullYear())
      formdata.append('entry.336519638', this.lastName)
      formdata.append('entry.1229441176', this.firstName)
      formdata.append('entry.859895391', this.entryTypes[this.entryType])

      return { formdata, datetime }
    },
    deleteLocalData() {
      window.localStorage.removeItem('start')
      window.localStorage.removeItem('end')
      location.reload()
    } 
  }
}
</script>

<style lang="postcss" scoped>
.form-button {
  @apply w-full text-center h-12 bg-orange-500 rounded text-white font-bold;

  &:disabled {
    @apply bg-orange-200;
  }
}
</style>
