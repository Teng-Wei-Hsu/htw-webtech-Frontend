import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import RestaurantCard from '@/components/RestaurantCard.vue'

const restaurant = {
  id: 1,
  name: 'Test Restaurant',
  country: 'Germany',
  city: 'Berlin',
  cuisineType: 'German',
  rating: 4.5,
  reviews: ['Nice food'],
  favorite: false
}

describe('RestaurantCard.vue', () => {
  it('renders restaurant information', () => {
    const wrapper = mount(RestaurantCard, {
      props: { restaurant }
    })

    expect(wrapper.text()).toContain('Test Restaurant')
    expect(wrapper.text()).toContain('Berlin')
    expect(wrapper.text()).toContain('German Cuisine')
    expect(wrapper.text()).toContain('Nice food')
  })

  it('emits toggle-favorite when favorite button is clicked', async () => {
    const wrapper = mount(RestaurantCard, {
      props: { restaurant }
    })

    await wrapper.find('.favorite-btn').trigger('click')

    expect(wrapper.emitted('toggle-favorite')).toBeTruthy()
    expect(wrapper.emitted('toggle-favorite')![0]).toEqual([1])
  })

  it('emits delete event with restaurant id', async () => {
    const wrapper = mount(RestaurantCard, {
      props: { restaurant }
    })

    await wrapper.find('.delete-btn').trigger('click')

    expect(wrapper.emitted('delete')).toBeTruthy()
    expect(wrapper.emitted('delete')![0]).toEqual([1])
  })

  it('emits edit event with restaurant object', async () => {
    const wrapper = mount(RestaurantCard, {
      props: { restaurant }
    })

    await wrapper.find('.edit-btn').trigger('click')

    expect(wrapper.emitted('edit')).toBeTruthy()
    expect(wrapper.emitted('edit')![0]).toEqual([restaurant])
  })

  it('shows fallback text when no reviews exist', () => {
    const wrapper = mount(RestaurantCard, {
      props: {
        restaurant: { ...restaurant, reviews: [] }
      }
    })

    expect(wrapper.text()).toContain('No reviews yet')
  })
})
