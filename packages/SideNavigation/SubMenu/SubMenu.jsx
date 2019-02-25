import React from 'react'
import PropTypes from 'prop-types'

import DecorativeIcon from '@tds/core-decorative-icon'
import Box from '@tds/core-box'
import Text from '@tds/core-text'
import safeRest from '@tds/shared-safe-rest'
import { Reveal } from '@tds/shared-animation'
import { componentWithName } from '@tds/util-prop-types'

import ColoredTextProvider from '../../../shared/components/ColoredTextProvider/ColoredTextProvider'
import joinClassNames from '../../../shared/utils/joinClassNames'

import styles from './SubMenu.scss'

/**
 * Expandable content areas for use with the `SideNavigation`
 *
 * _This component can only be accessed as a name-spaced component: `SideNavigation.SubMenu`._
 */
class SubMenu extends React.Component {
  constructor(props) {
    super(props)

    this.subMenu = null
  }

  state = {
    subMenuHeight: 0,
  }

  componentDidUpdate() {
    this.adjustHeight()
  }

  handleClick = () => {
    if (this.props.onClick) {
      this.props.onClick()
    }
    this.props.handleToggleSubMenu(this.props.id)
  }

  adjustHeight = () => {
    if (this.subMenu.offsetHeight !== this.state.subMenuHeight) {
      this.setState({ subMenuHeight: this.subMenu.offsetHeight })
    }
  }

  options = {
    subMenuLink: true,
  }

  subMenuClasses = joinClassNames(
    styles.buttonSubMenu,
    this.props.active ? styles.active : styles.buttonDefault
  )

  render() {
    const { children, label, isOpen, active, ...rest } = this.props

    return (
      <div className={styles.mainDiv}>
        <button {...safeRest(rest)} onClick={this.handleClick} className={this.subMenuClasses}>
          <Box vertical={3} inline horizontal={2} dangerouslyAddClassName={styles.space}>
            <ColoredTextProvider>
              <Text size="medium" bold={active}>
                {label}
              </Text>
            </ColoredTextProvider>
            <DecorativeIcon
              symbol={isOpen ? 'caretUp' : 'caretDown'}
              variant="secondary"
              size={16}
            />
          </Box>
        </button>
        <Reveal
          timeout={isOpen ? 500 : 0}
          duration={500}
          in={isOpen}
          height={this.state.subMenuHeight}
        >
          {() => (
            <ul
              ref={c => {
                this.subMenu = c
              }}
              className={styles.subMenuDropDown}
            >
              {React.Children.map(children, child => (
                <li>{React.cloneElement(child, this.options)}</li>
              ))}
            </ul>
          )}
        </Reveal>
      </div>
    )
  }
}

SubMenu.propTypes = {
  /**
   * An array of `SideNavigation.Link`.
   */
  children: componentWithName('Link'),
  /**
   * Label of the SubMenu.
   */
  label: PropTypes.string.isRequired,
  /**
   * Behaviour when clicking the SubMenu. Passed from <SideNavigation> to toggle open or close the SubMenu.
   *
   * @ignore
   */
  handleToggleSubMenu: PropTypes.func,
  /**
   * ID of the SubMenu, must be unique when using multiple SubMenus within the same SideNavigation component.
   * @ignore
   */
  id: PropTypes.string,
  /**
   * Describes whether this SubMenu is open or not. Used in conjunction with ID so that only one SubMenu is open at a time.
   *
   * @ignore
   */
  isOpen: PropTypes.bool,
  /**
   * State of whether user is in one of the links in the SubMenu.
   */
  active: PropTypes.bool,
  /**
   * Click handler.
   *
   * @ignore
   */
  onClick: PropTypes.func,
}

SubMenu.defaultProps = {
  handleToggleSubMenu: undefined,
  isOpen: false,
  active: false,
  children: undefined,
  id: undefined,
  onClick: undefined,
}

export default SubMenu
