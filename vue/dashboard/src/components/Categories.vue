<template>
  <as-category-widget ref="category"
    show-clear-button
    heading="Neighbourhood"
    description="Name of the neighborhood flat belongs to"
    >
  </as-category-widget>
</template>

<script>

export default {
  name: 'Category',
  props: {
    categories: Array,
    categoryStore: Object,
  },
  mounted: function () {
    this.category = this.$refs.category;

    this.category.addEventListener('categoriesSelected', (e) => {
      this.categoryStore.setSelected(e.detail);
    });
  },
  watch: {
    categories: function (newVal) {
      this.category.categories = newVal;
    }
  }
}
</script>

