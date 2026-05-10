# Generator Script Pattern

When creating a generator script:

```javascript
// Structure
const config = { COMPONENTS_DIR, OUTPUT_DIR, ... };

// Utilities
function readFile(path) { ... }
function writeOutput(filename, content) { ... }

// Extractors (one per data source)
function extractComponents() { ... }
function extractTokens() { ... }

// Generators (one per output file)
function generateIndex() { ... }
function generateVersion() { ... }
function generateDomain() { ... }

// Main
function main() {
  // Extract all data
  // Generate all files
  // Log summary
}

// Export for testing
module.exports = { extractors, generators };

// Run if main
if (require.main === module) main();
```

Add to package.json:
```json
{
  "scripts": {
    "generate:llms": "node build-scripts/create-llms-docs.js"
  }
}
```
