import { ScSearchBar } from '@scboson/sc-element'
import ToolBar from '../ToolBar'

import styles from './index.less'

const BsSearch = (props: any) => {
  const { toolbar, ...resProps } = props

  const hasToolBar = Array.isArray(toolbar) && toolbar.length > 0

  return (
    <>
      {hasToolBar ? (
        <div className={styles['bs-search-toolbar']}>
          <ToolBar
            buttons={toolbar}
            className={styles['bs-table-toolbar-btn']}
          ></ToolBar>
        </div>
      ) : null}
      <div className={styles['bs-supplier-search']}>
        <ScSearchBar {...resProps}></ScSearchBar>
      </div>
    </>
  )
}

export default BsSearch
