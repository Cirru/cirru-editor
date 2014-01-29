
define (require, exports) ->

  $ = require 'jquery'
  caret = '<div class="cirru-caret"></div>'

  class Unit
    constructor: ->
      @list = []

    indexOf: (item) ->
      @list.indexOf item

    getLength: ->
      @list.length

    selfLocate: ->
      @parent.indexOf @

    push: (item) ->
      @list.push item

    splice: (args...) ->
      @list.splice args...

    drop: ->
      if @parent?
        @parent.splice @selfLocate(), 1
        delete @parent

    hasParent: ->
      @parent?

    isToken: ->
      @type is 'Token'

    isExp: ->
      @type is 'Exp'

    hasContent: ->
      @list.length > 0

    isEmpty: ->
      @list.length is 0

    toParent: (caretObj) ->
      parent = @parent
      if @isEmpty() and @hasParent()
        @parent.splice @selfLocate(), 1
        delete @parent
        caretObj.index -= 1 if caretObj?
      parent

  class Token extends Unit
    type: 'Token'
    constructor: (@parent) ->
      super()

  class Exp extends Unit
    type: 'Exp'
    constructor: (@parent) ->
      super()

    makeToken: ->
      new Token @

    makeExp: ->
      new Exp @

    getItem: (index) ->
      @list[index]

  class Editor
    constructor: ->
      @makeElement()
      @bindEvents()
      @tree = new Exp
      @pointer = @tree.makeToken()
      @tree.push @pointer
      @index = 0
      @render()

    makeElement: ->
      @el = $ '<div>'
      @el.attr 'class', 'cirru-editor'
      @area = $ '<pre class="cirru-area"/>'
      @input = $ '<input class="cirru-input"/>'

      @el.append @area
      @el.append @input

    bindEvents: ->
      @el.on 'click', =>
        @input.focus()
        console.info 'focusing on editor!'
      @input.on 'keypress', @handlePress.bind(@)
      @input.on 'keydown', @handeKeyDown.bind(@)

    render: ->
      convert = (obj) =>
        if obj.isToken()
          list = obj.list.concat()
          list.splice @index, 0, caret if @pointer is obj
          inner = list.join ''
          "<div class='cirru-token'>#{inner}</div>"
        else if obj.isExp()
          list = obj.list.concat().map(convert)
          list.splice @index, 0, caret if @pointer is obj
          inner = list.join ''
          "<div class='cirru-exp'>#{inner}</div>"
      console.debug @pointer, @index
      html = convert @tree
      @area.html html
      @el.find('.cirru-caret').get(0).scrollIntoView()

    handlePress: (event) ->
      char = String.fromCharCode event.charCode
      @insertChar char
      @render()
      event.preventDefault()

    handeKeyDown: (event) ->
      signiture = []
      signiture.push 'alt' if event.altKey
      signiture.push 'ctrl' if event.ctrlKey
      signiture.push 'meta' if event.metaKey
      signiture.push 'shift' if event.shiftKey
      signiture.push event.keyCode
      identifier = signiture.join ' '
      @action identifier, event
      @render()

    action: (name, event) ->
      switch name
        when '37'
          @actionLeft()
        when '39'
          @actionRight()
        when '38'
          @actionUp()
        when '40'
          @actionDown()
        when '13'
          @actionEnter()
          event.preventDefault()
        when '8'
          @actionDelete()
          event.preventDefault()
        when '9'
          @insertChar ' '
          event.preventDefault()
        when '32'
          @actionBlank()
          event.preventDefault()
        when 'alt 37'
          @actionWordLeft()
          event.preventDefault()
        when 'alt 39'
          @actionWordRight()
          event.preventDefault()
        
      console.info 'unhandled action:', name

    insertChar: (char) ->
      if @pointer.isToken()
        @pointer.splice @index, 0, char
        @index += 1
      else if @pointer.isExp()
        newToken = @pointer.makeToken()
        newToken.push char
        @pointer.splice @index, 0, newToken
        @pointer = newToken
        @index = 1

    actionBlank: ->
      if @pointer.isExp()
        return
      else if @pointer.isToken()
        @index = @pointer.selfLocate() + 1
        @pointer = @pointer.parent

    actionUp: ->
      if @index > 0
        @index = 0
      else
        if @pointer.hasParent()
          @pointer = @pointer.toParent()
          @index = 0

    actionDown: ->
      if @index < @pointer.getLength()
        @index = @pointer.getLength()
      else
        if @pointer.hasParent()
          @index = @pointer.parent.getLength()
          @pointer = @pointer.toParent()

    actionLeft: ->
      if @pointer.isToken()
        if @index > 0
          @index -= 1
        else
          @index = @pointer.selfLocate()
          @pointer = @pointer.toParent()
      else if @pointer.isExp()
        if @index > 0
          lastToken = @pointer.getItem (@index - 1)
          @pointer = lastToken
          @index = lastToken.getLength()
        else
          if @pointer.hasParent()
            @index = @pointer.selfLocate()
            @pointer = @pointer.toParent()

    actionRight: ->
      if @pointer.isToken()
        if @index < @pointer.getLength()
          @index += 1
        else
          @index = @pointer.selfLocate() + 1
          @pointer = @pointer.toParent(@)
      else if @pointer.isExp()
        if @index < @pointer.getLength()
          nextToken = @pointer.getItem @index
          @pointer = nextToken
          @index = 0
        else
          if @pointer.hasParent()
            @index = @pointer.selfLocate() + 1
            @pointer = @pointer.toParent(@)

    actionEnter: ->
      if @pointer.isToken()
        newExp = @pointer.parent.makeExp()
        entry = @pointer.selfLocate() + 1
        if @pointer.hasContent()
          @pointer.parent.splice entry, 0, newExp
        else if @pointer.isEmpty()
          @pointer.parent.splice entry, 1, newExp
        @pointer = newExp
        @index = 0
      else if @pointer.isExp()
        newExp = @pointer.makeExp()
        @pointer.splice @index, 0, newExp
        @pointer = newExp
        @index = 0

    actionDelete: ->
      if @pointer.isToken()
        if @index > 0
          @index -= 1
          @pointer.splice @index, 1
        else
          @index = @pointer.selfLocate()
          @pointer.parent.splice @index, 1
          @pointer = @pointer.parent
      else if @pointer.isExp()
        if @index > 0
          @index -= 1
          @pointer.splice @index, 1

    actionWordLeft: ->
      if @pointer.isToken()
        @index = @pointer.selfLocate()
        @pointer = @pointer.toParent()
      else if @pointer.isExp()
        if @index > 0
          @index -= 1
        else
          if @pointer.hasParent()
            @index = @pointer.selfLocate()
            @pointer = @pointer.toParent()

    actionWordRight: ->
      if @pointer.isToken()
        @index = @pointer.selfLocate() + 1
        @pointer = @pointer.toParent(@)
      else if @pointer.isExp()
        if @index < @pointer.getLength()
          @index += 1
        else
          if @pointer.hasParent()
            @index = @pointer.selfLocate() + 1
            @pointer = @pointer.toParent(@)

  {Editor}