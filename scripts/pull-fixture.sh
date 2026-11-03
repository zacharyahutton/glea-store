#!/usr/bin/env bash
# Refresh the fixture from the real store with the Admin API (read only).
# Needs: Shopify CLI, and `shopify store auth` done once for the store.
set -euo pipefail
cd "$(dirname "$0")/.."
STORE="${SHOPIFY_STORE:-gjqatv-06.myshopify.com}"
TMP="$(mktemp)"
shopify store execute -s "$STORE" --query-file scripts/fixture-query.graphql -j > "$TMP"
python3 scripts/build-fixture.py "$TMP" lib/shopify/fixture/store.json
rm -f "$TMP"
echo "Fixture written to lib/shopify/fixture/store.json"
