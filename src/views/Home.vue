<template>
  <div class="container mx-auto px-3 mt-12 md:mt-24">
    <div class="max-w-md mx-auto">
      <div class="mb-12">
        <h1 class="text-xl md:text-2xl font-bold">Condică de prezență</h1>
        <div class="text-gray-700 mt-4">
          <p>În fiecare zi, înainte de a începe ziua de lucru accesează acest site și apasă pe butonul <em>Începe ziua</em>, pentru a fi reținută data și ora începerii. La sfrâșitul zilei se aplică aceaași metodă. Datele tale sunt salvate local (e.g. pe telefon.)</p>
        </div>
      </div>
      <the-form />
    </div>
  </div>
</template>

<script>
import TheForm from '../components/Form'

export default {
  name: 'Home',
  components: {
    TheForm
  },
  methods: {
    deleteLocalData() {
      window.localStorage.removeItem('start')
      window.localStorage.removeItem('end')
    }
  }
}
</script>
