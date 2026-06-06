import LocationAutocomplete from './LocationAutocomplete';

/**
 * RegionInputComponent — wrapper that uses the new smart Egypt location autocomplete.
 * Keeps the same props interface ({ region, setRegion, label }) so all existing
 * usages (ClientOnboard, VendorOnboardPage, VendorProfilePage) work without changes.
 */
function RegionInputComponent({ region, setRegion, label = "Location" }) {
    return (
        <LocationAutocomplete
            label={label}
            value={region}
            onChange={setRegion}
        />
    );
}

export default RegionInputComponent;
