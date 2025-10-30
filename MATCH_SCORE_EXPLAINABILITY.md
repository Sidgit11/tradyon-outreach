# Match Score Explainability Feature

## Overview

This feature provides transparent explanations for match scores displayed in the application. Users can understand why a particular company or buyer received a specific match score through an intuitive tooltip and detailed popover interface.

## Zero-Credit Guarantee

**This feature uses ZERO credits.** All match score explanations are derived from pre-computed data stored in Supabase. No external API calls or enrichment services are triggered when viewing explanations.

## User Interface

### Match Score Chip
- Displays the match score as a colored badge
- Color-coded based on score range:
  - 90-100: Green (excellent match)
  - 80-89: Blue (good match)
  - 70-79: Yellow (fair match)
  - Below 70: Gray (low match)

### Tooltip (Hover)
- Appears after 200ms hover on the chip
- Shows top 3 reasons for the match
- No API calls - uses pre-loaded data
- Icons indicate positive (✓), negative (⚠), or neutral (ℹ) signals

### Popover (Click)
- Opens on chip click
- Shows up to 5 detailed reasons with contribution bars
- Displays numeric contribution values (e.g., "+22 pts")
- Includes total contribution summary
- "Improve this match" link for guidance
- Keyboard accessible (Esc to close, Tab to navigate)
- Click outside or press Esc to close

## Six Signals

Match scores are explained using these six signals:

1. **Spec Fit** (`spec_fit`) - Product specification match
2. **Geo Fit** (`geo_fit`) - Geographic/lane overlap
3. **Partner Proximity** (`partners`) - Shared suppliers/forwarders
4. **Price Band** (`price_band`) - Price compatibility
5. **Recency & Frequency** (`rfv`) - Recent activity and volume
6. **Volume Band** (`moq`) - MOQ/volume requirements fit

Each signal is classified as:
- **Positive** (green ✓): Contributes positively to the match
- **Negative** (red ⚠): Reduces the match score
- **Neutral** (gray ℹ): No significant impact

## Database Schema

### Tables

#### `match_score_reasons`
Stores the main explanation record for each entity:
- `id`: Primary key
- `entity_id`: Company or buyer ID
- `entity_type`: 'company' or 'buyer'
- `match_score`: The match score (0-100)
- `top_reasons`: JSONB array of top 3 reasons
- `created_at`: Timestamp

#### `match_reason_details`
Stores detailed breakdowns:
- `id`: Primary key
- `match_score_reason_id`: Foreign key to match_score_reasons
- `reason_id`: One of the six signal IDs
- `label`: Human-readable label
- `direction`: 'pos', 'neg', or 'neu'
- `contribution`: Numeric contribution value
- `sort_order`: Display order (1-5)
- `created_at`: Timestamp

## Implementation Files

- **Component**: `src/components/MatchScoreChip.tsx`
- **API Layer**: `src/api/matchReasons.ts`
- **Analytics**: `src/utils/analytics.ts`
- **Seed Script**: `src/utils/seedMatchReasons.ts`
- **Types**: `src/types/index.ts` (MatchReason, MatchScoreExplanation)

## Analytics

Three events are tracked (console logs for now, can be integrated with PostHog/Mixpanel):

1. `match_reason_view_hover` - Tooltip displayed
2. `match_reason_view_click` - Popover opened
3. `match_reason_improve_click` - "Improve this match" clicked

No PII is logged - only entity type, entity ID, match score, and timestamp.

## Seeding Data

To seed the database with dummy match reason data:

```bash
VITE_SUPABASE_URL="your_url" VITE_SUPABASE_ANON_KEY="your_key" npx tsx src/seedData.ts
```

The seed script automatically generates realistic reasons based on match scores:
- High scores (85+): Emphasize positive signals
- Medium scores (70-84): Mix of positive and neutral
- Low scores (<70): Include negative signals

## Accessibility

- Keyboard navigable (Tab, Enter, Space, Esc)
- Screen reader compatible with ARIA labels
- Focus trap in popover
- Focus returns to chip on close
- Sufficient color contrast for all states

## Performance

- Tooltip: <50ms render time (no async calls)
- Popover: <300ms to load full breakdown (cached)
- In-memory cache prevents redundant API calls
- Debounced hover prevents flicker

## Future Enhancements

- Add confidence levels for each reason
- Allow users to provide feedback on explanations
- Real-time recalculation based on filter changes
- Export explanations to PDF/CSV
- Integration with PostHog/Mixpanel for production analytics
