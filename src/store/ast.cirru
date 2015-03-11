
= EventEmitter  $ require :wolfy87-eventemitter
= dispatcher    $ require :../dispatcher
= manipulations $ require :../util/manipulations
= caret         $ require :../util/caret

= store $ JSON.parse $ or
  localStorage.getItem :cirru-ast
  , :[]

= focus $ array

= astStore $ new EventEmitter

= astStore.dispatchToken $ dispatcher.register $ \ (action)

  switch action.type
    :update-token
      = store $ manipulations.updateToken store action.coord action.text
      astStore.onchange
    :remove-node
      = store $ manipulations.removeNode store action.coord
      = focus $ caret.backward store action.coord
      astStore.onchange
    :before-token
      = store $ manipulations.beforeToken store action.coord
      astStore.onchange
    :after-token
      = store $ manipulations.afterToken store action.coord
      = focus $ caret.forward store action.coord
      astStore.onchange
    :prepend-token
      = store $ manipulations.prependToken store action.coord
      = focus $ caret.inside store action.coord
      astStore.onchange
    :pack-node
      = store $ manipulations.packNode store action.coord
      = focus $ caret.inside store action.coord
      astStore.onchange
    :unpack-expr
      = store $ manipulations.unpackExpr store action.coord
      = focus action.coord
      astStore.onchange
    :drop-to
      = store $ manipulations.dropTo store focus action.coord
      = focus action.coord
      astStore.onchange
    :focus-to
      = focus action.coord
      astStore.onchange

_.assign astStore $ object
  :onchange $ \ ()
    localStorage.setItem :cirru-ast $ JSON.stringify store
    @emit :change

  :get $ \ () store

  :getFocus $ \ () focus

= module.exports astStore
