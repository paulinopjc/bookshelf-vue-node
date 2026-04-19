import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import StatusBadge from '@/components/books/StatusBadge.vue'

describe('StatusBadge', () => {
  it('renders the unread label and grey classes', () => {
    const wrapper = mount(StatusBadge, { props: { status: 'unread' } })
    expect(wrapper.text()).toBe('Unread')
    expect(wrapper.classes()).toContain('bg-gray-100')
  })

  it('renders the reading label and amber classes', () => {
    const wrapper = mount(StatusBadge, { props: { status: 'reading' } })
    expect(wrapper.text()).toBe('Reading')
    expect(wrapper.classes()).toContain('bg-amber-100')
  })

  it('renders the finished label and green classes', () => {
    const wrapper = mount(StatusBadge, { props: { status: 'finished' } })
    expect(wrapper.text()).toBe('Finished')
    expect(wrapper.classes()).toContain('bg-green-100')
  })
})