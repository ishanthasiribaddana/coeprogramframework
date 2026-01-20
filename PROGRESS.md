# COE Program Framework - Progress Notes

## Last Session: Jan 20, 2026

### Completed (v1.2.0)
- ✅ Autocomplete for External Partnerships, Placement Partners, Student Associations
- ✅ Save button in cards (active when all fields filled)
- ✅ Database normalization: `organizations` + `organization_types` + `program_organizations`
- ✅ Backend uses `program_organizations` junction table
- ✅ PM2 ecosystem config: `/server/ecosystem.config.cjs`
- ✅ Dropdown visibility and onBlur fixes

### Key Files Modified
- `src/App.jsx` - ProgramCard with autocomplete and Save button
- `server/routes/programs.js` - Uses program_organizations table
- `server/routes/organizations.js` - New normalized API
- `src/api.js` - Updated API endpoints

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
