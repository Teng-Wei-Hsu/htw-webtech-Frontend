import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
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

    // wait for fetch + render
    await new Promise(resolve => setTimeout(resolve, 0))

    expect(wrapper.text()).toContain('Pizza Place')
    expect(wrapper.text()).toContain('Sushi Bar')
  })

  it('filters restaurants by city', async () => {
    const wrapper = mount(RestaurantList)

    await new Promise(resolve => setTimeout(resolve, 0))

    const select = wrapper.find('select')
    await select.setValue('Rome')

    expect(wrapper.text()).toContain('Pizza Place')
    expect(wrapper.text()).not.toContain('Sushi Bar')
  })

  it('renders filter bar', async () => {
    const wrapper = mount(RestaurantList)

    await new Promise(resolve => setTimeout(resolve, 0))

    expect(wrapper.find('.filter-bar').exists()).toBe(true)
  })
})
