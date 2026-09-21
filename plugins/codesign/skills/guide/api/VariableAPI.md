# VariableAPI

## Variable Management

Create, update, retrieve, and remove text variables from the engine.

### findAll()

Get all text variable names currently stored in the engine.

```typescript
findAll(): string[]
```

**Returns:** List of variable names.

### setString()

Set a text variable's value.
Creates a new variable if the key doesn't exist, or updates an existing one.

```typescript
setString(key: string, value: string): void
```

**Parameters:**
- `key` - The variable's key.
- `value` - The text value to assign to the variable.

### getString()

Get a text variable's value.

```typescript
getString(key: string): string
```

**Parameters:**
- `key` - The variable's key.

**Returns:** The text value of the variable.

### remove()

Remove a text variable from the engine.

```typescript
remove(key: string): void
```

**Parameters:**
- `key` - The variable's key to remove.

---

For complete type definitions, see the [CE.SDK TypeScript API Reference](https://img.ly/docs/cesdk/engine/api/).