# Code Guidelines

- This document defines JavaScript coding rules for booth style and functionality.
- The statements in this document should be followed as strictly as possible.
- If any undefined code situation arises it should be discussed by the development team and the document should be updated.



### Formatting

- Code should be indented using tabs (don't use spaces for indentation).
  - Allows each development to configure its IDE to display spacing as preferred.
- Never create local copies of constant values, use the constant values directly.
- Avoid creating functions that are specific to a single use scenario.
- Never create single use variables
  - e.g `var a = 2; abc(a);` write `abc(2);` instead.
- Variables should be always explicitly declared.



### Naming

##### Definitions

- **PascalCase** names capitalize the first letter of each word, including the first.
- **lowerCamelCase** names capitalize the first letter of each word, except the first which is always lowercase, even if it’s an acronym.
- **SCREAMING_CAPS** use only uppercase letters, even for acronyms, and separate words with _.
- Avoid using big names, if a name if composed for more than 3 words simplify it.
- Try to keep names in context but perceptible.
  - E.g. If key belong to module there is no need to call it ModuleKey, Key should be enough.

##### Classes, Interfaces, Types

- Classes, typedefs, and types should use `PascalCase`

##### Namespaces

- Module  namespaces should use `PascalCase` but could in some cases use `SCREAMING_CAPS`

##### Variables, Methods

- Variables and methods should use `camelCase`

##### Static constant attributes

- Static constant attributes of a Class/Interface should use `SCREAMING_CAPS` 

##### Files

- Code files should use `PascalCase` in their name, if a file defines a class is should have the same name as the class that is defines.
- Markdown files use `SCREAMING_CAPS` in their name.
- All folders use `camelCase` in their name.


### Comments

##### Comments

- Comments should always use `//`  when they are single line with a space at the beginning.
- Multiline comments should be written between `//`, without any `*` on the beginning of new lines.
- All comments should use the same indentation as the code block where they are placed.

```javascript
// This is a single line comment

/*
This is a multi line comment
That does not represent documentation
*/
```

- Comments should never occupy more than 3 lines.
- References to future tasks, (tasks / functionality that will be implemented later and merger on another PR) should start with the `TODO` word and surrounded by `<>`

```javascript
// TODO <Add new functionality later here>
```