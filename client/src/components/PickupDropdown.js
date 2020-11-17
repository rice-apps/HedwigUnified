import Dropdown from 'react-dropdown'
import 'react-dropdown/style.css'
import './components.css'

export const PickupDropdown = ({ selectedOption, options, onChange }) => {
  return (
    <Dropdown
      controlClassName='pickupDropdownControl'
      options={options}
      onChange={onChange}
      value={selectedOption}
    />
  )
}
