
# Wholesale Product Configuration

## Overview
This directory contains configuration files for converting Excel wholesale data into product formats for the Marimekko wholesale system.

## Supported Formats

### Excel Input Format
- **File Type**: `.xlsx`, `.xls`
- **Required Columns**: Product Name, Product code, EAN, Color ID, Color, Wholesale price, Retail price, Available stock
- **Optional Columns**: Client ID, Item Number (#)

### Output Product Formats

#### JSON Format
```json
{
    "clientId": "string",
    "products": [
        {
            "#": "number",
            "Product Name": "string",
            "Product code": "string",
            "EAN": "string",
            "Color ID": "string",
            "Color": "string",
            "Wholesale price": "string",
            "Retail price": "string",
            "Available stock": "number"
        }
    ]
}
```

#### CSV Format
- Comma-separated values with headers
- UTF-8 encoding
- Marimekko wholesale product schema

## Configuration Options

### Conversion Settings
- **Date Format**: `YYYY-MM-DD`
- **Currency**: Default to EUR
- **Price Format**: String with 2 decimal places
- **Stock Units**: Integer count

### Validation Rules
- Product code must be unique
- EAN must be valid barcode format
- Wholesale/Retail prices must be positive
- Available stock must be integer ≥ 0
- Color ID must match predefined codes

## Usage
Place Excel files in the input directory and run the conversion process to generate Marimekko product data in the specified format.

