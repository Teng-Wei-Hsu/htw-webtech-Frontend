import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import RestaurantList from '../RestaurantList.vue'

// Mock backend data
const mockRestaurants = [
  {
    id: 1,
    name: 'Pizza Place',
    country: 'Italy',
    city: 'Rome',
    cuisineType: 'Italian',
    rating: 4.8,
    reviews: ['Great'],
    favorite: false
  },
  {
    id: 2,
    name: 'Sushi Bar',
    country: 'Japan',
    city: 'Tokyo',
    cuisineType: 'Japanese',
    rating: 4.2,
    reviews: ['Fresh'],
    favorite: true
  }
]

beforeEach(() => {
  vi.stubGlobal('fetch', vi.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve(mockRestaurants)
    } as Response)
  ))
})

describe('RestaurantList.vue', () => {
  it('renders restaurant list', async () => {
    const wrapper = mount(RestaurantList)
    await flushPromises()

    expect(wrapper.text()).toContain('Pizza Place')
    expect(wrapper.text()).toContain('Sushi Bar')
  })

  it('renders filter bar', async () => {
    const wrapper = mount(RestaurantList)
    await flushPromises()

    expect(wrapper.find('.filter-bar').exists()).toBe(true)
  })

  it('filters restaurants by city', async () => {
    const wrapper = mount(RestaurantList)
    await flushPromises()

    const citySelect = wrapper.find('select')
    await citySelect.setValue('Rome')

    expect(wrapper.text()).toContain('Pizza Place')
    expect(wrapper.text()).not.toContain('Sushi Bar')
  })

  it('filters restaurants by cuisine', async () => {
    const wrapper = mount(RestaurantList)
    await flushPromises()

    const selects = wrapper.findAll('select')
    expect(selects.length).toBeGreaterThan(1)

    const cuisineSelect = selects[1]
    await cuisineSelect.setValue('Japanese')

    expect(wrapper.text()).toContain('Sushi Bar')
    expect(wrapper.text()).not.toContain('Pizza Place')
  })

  it('filters restaurants by rating >= 4.5', async () => {
    const wrapper = mount(RestaurantList)
    await flushPromises()

    const checkbox = wrapper.find('input[type="checkbox"]')
    await checkbox.setValue(true)

    expect(wrapper.text()).toContain('Pizza Place')
    expect(wrapper.text()).not.toContain('Sushi Bar')
  })

  it('starts edit mode when edit is triggered', async () => {
    const wrapper = mount(RestaurantList)
    await flushPromises()

    // find first RestaurantCard and emit edit
    const card = wrapper.findComponent({ name: 'RestaurantCard' })
    await card.vm.$emit('edit', mockRestaurants[0])

    expect(wrapper.text()).toContain('Edit Restaurant')
    expect(wrapper.text()).toContain('Pizza Place')
  })
})

