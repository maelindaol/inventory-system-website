# mongoose-plugin-date-format

[![CI](https://github.com/oktapodia/mongoose-plugin-date-format/actions/workflows/workflow.yml/badge.svg)](https://github.com/oktapodia/mongoose-plugin-date-format/actions/workflows/workflow.yml)
[![npm version](https://badge.fury.io/js/mongoose-plugin-date-format.svg)](https://badge.fury.io/js/mongoose-plugin-date-format)

Change the date field default output in your mongoose schemas

**Note:** This plugin will *only* work with mongoose >= 4.0. Do NOT use
this plugin with mongoose 3.x. You have been warned.

# Usage

The `mongoose-plugin-date-format` module exposes a single function that you can
pass to [Mongoose schema's `plugin()` function](https://mongoosejs.com/docs/api.html#schema_Schema-plugin).

```javascript
const schema = new mongoose.Schema({
  birthdate: Date,
});
schema.plugin(require('mongoose-plugin-date-format')('YYYY-MM-DDTHH:mm:ss[Z]'));
```
