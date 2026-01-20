# COE Program Framework - Progress Notes

## Last Session: Jan 20, 2026

### Completed Versions

#### v1.2.2 (Latest)
- ✅ "Add as new" option in autocomplete dropdowns when no match found
- ✅ New organizations saved to database immediately
- ✅ Organization lists refresh after adding new items

#### v1.2.1
- ✅ Duration field moved to first row with Module Name
- ✅ Label shortened to "Dur: (Hrs)"
- ✅ Duration field right-aligned

#### v1.2.0
- ✅ Autocomplete for External Partnerships, Placement Partners, Student Associations
- ✅ Save button in cards (active when all fields filled)
- ✅ Database normalization: `organizations` + `organization_types` + `program_organizations`
- ✅ Backend uses `program_organizations` junction table
- ✅ PM2 ecosystem config: `/server/ecosystem.config.cjs`
- ✅ Dropdown visibility and onBlur fixes

### Key Files Modified
- `src/App.jsx` - ProgramCard with autocomplete, Save button, add new org
- `server/routes/programs.js` - Uses program_organizations table
- `server/routes/organizations.js` - New normalized API with create endpoints
- `src/api.js` - Updated API endpoints including create methods

### Database
- `organizations` table (merged external/placement/associations)
- `organization_types` (1=External, 2=Placement, 3=Association)
- `program_organizations` (junction table)

### PM2
```bash
pm2 start /var/www/coe-program-framework/server/ecosystem.config.cjs
```

### Next Steps (if any)
- Consider multi-type organizations (one org can be multiple types)
- Add more organizations via admin panel
