import React from 'react'
import * as packages from '../../package.json'

const Copyright: React.FC = () => (
  <footer className="info">
    <p>
      Created by <a href="https://ryota-murakami.github.io/">{packages.name}</a>
    </p>
    <p>
      Part of <a href="http://todomvc.com">{packages.name}</a>
    </p>
  </footer>
)

export default Copyright
