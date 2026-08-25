import React, { useState } from 'react';
import { Checkbox, Collapse } from 'antd';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import styles from './style.module.scss';

const CastingFilters = ({
  locations = [],
  projectTypes = [],
  roleTypes = [],
  ageRanges = [],
  selectedLocations = [],
  selectedProjectTypes = [],
  selectedRoleTypes = [],
  onLocationChange,
  onProjectTypeChange,
  onRoleTypeChange,
  selectedAgeRanges = [],
  onAgeRangeChange,
  onAgeRangeSelectAll
}) => {
  const [activeKey, setActiveKey] = useState(['location']); // only one open at a time

  const handleCollapseChange = (key) => {
    setActiveKey(key.length ? [key[key.length - 1]] : []);
  };

  // Render location + nested sub-locations
  const renderLocationItem = (location) => {
    if (location.subLocations?.length) {
      const regionSelected = selectedLocations.includes(location.name);

      return (
        <Collapse
          ghost
          expandIconPosition="end"
          className={styles.nestedCollapse}
          key={location.name}
          items={[{
            key: location.name,
            label: (
              <Checkbox
                checked={regionSelected}
                onChange={(e) => {
                  // Check/uncheck region name only — API handles the rest
                  onLocationChange({
                    target: { value: location.name, checked: e.target.checked },
                  });
                  // Remove any individual sub-locations if region is being checked
                  if (e.target.checked) {
                    location.subLocations.forEach((sub) =>
                      onLocationChange({
                        target: { value: sub, checked: false },
                      })
                    );
                  }
                }}
              >
                {location.name}
              </Checkbox>
            ),
            children: (
              <div className={styles.optionsList}>
                {location.subLocations.map((sub) => (
                  <Checkbox
                    key={sub}
                    value={sub}
                    onChange={(e) => {
                      if (regionSelected) {
                        // Uncheck region, check all subs except this one
                        onLocationChange({
                          target: { value: location.name, checked: false },
                        });
                        location.subLocations
                          .filter((s) => s !== sub)
                          .forEach((s) =>
                            onLocationChange({
                              target: { value: s, checked: true },
                            })
                          );
                      } else {
                        onLocationChange(e);

                        // If this was the last sub needed, swap to region
                        const nowSelected = location.subLocations.filter(
                          (s) => s === sub ? e.target.checked : selectedLocations.includes(s)
                        );
                        if (nowSelected.length === location.subLocations.length) {
                          location.subLocations.forEach((s) =>
                            onLocationChange({
                              target: { value: s, checked: false },
                            })
                          );
                          onLocationChange({
                            target: { value: location.name, checked: true },
                          });
                        }
                      }
                    }}
                    checked={regionSelected || selectedLocations.includes(sub)}
                    style={{ marginLeft: 16 }}
                  >
                    {sub}
                  </Checkbox>
                ))}
              </div>
            ),
          }]}
        />
      );
    }

    return (
      <Checkbox
        key={location.name || location}
        value={location.name || location}
        onChange={onLocationChange}
        checked={selectedLocations.includes(location.name || location)}
      >
        {location.name || location}
      </Checkbox>
    );
  };
  const items = [
    {
      key: 'location',
      label: 'Working Location',
      children: (
        <>
          <Checkbox
            indeterminate={
              selectedLocations.length > 0 &&
              !locations.every((loc) => selectedLocations.includes(loc.name))
            }
            checked={
              locations.length > 0 &&
              locations.every((loc) => selectedLocations.includes(loc.name))
            }
            onChange={(e) => {
              // Just toggle region names — API filters all their sub-locations automatically
              locations.forEach((loc) =>
                onLocationChange({ target: { value: loc.name, checked: e.target.checked } })
              );
            }}
          >
            Select All
          </Checkbox>

          <div className={styles.optionsList}>
            {locations.map(renderLocationItem)}
          </div>
        </>
      ),
    },
    {
      key: 'age',
      label: 'Playable Age Range',
      children: (
        <>
          <Checkbox
            onChange={(e) => onAgeRangeSelectAll(e.target.checked)}
            checked={selectedAgeRanges.length === ageRanges.length}
          >
            Select All
          </Checkbox>
          <div className={styles.optionsList}>
            {ageRanges.map((range) => (
              <Checkbox
                key={range}
                value={range}
                onChange={(e) =>
                  onAgeRangeChange(e.target.value, e.target.checked)
                }
                checked={selectedAgeRanges.includes(range)}
              >
                {range}
              </Checkbox>
            ))}
          </div>
        </>
      ),
    },
    {
      key: 'project',
      label: 'Project Type',
      children: (
        <div className={styles.optionsList}>
          {projectTypes.map((type) => (
            <Checkbox
              key={type.id}
              value={type.projectTypeName}
              onChange={onProjectTypeChange}
              checked={selectedProjectTypes.includes(type.projectTypeName)}
            >
              {type.projectTypeName}
            </Checkbox>
          ))}
        </div>
      ),
    },
    {
      key: 'role',
      label: 'Role Type',
      children: (
        <div className={styles.optionsList}>
          {roleTypes.map((type) => (
            <Checkbox
              key={type.id}
              value={type.roleTypeName}
              onChange={onRoleTypeChange}
              checked={selectedRoleTypes.includes(type.roleTypeName)}
            >
              {type.roleTypeName}
            </Checkbox>
          ))}
        </div>
      ),
    },
  ];

  return (
    <div className={styles.sidebar}>
      <Collapse
        ghost
        accordion
        activeKey={activeKey}
        onChange={handleCollapseChange}
        expandIconPosition="end"
        expandIcon={({ isActive }) =>
          isActive ? <UpOutlined /> : <DownOutlined />
        }
        items={items}
      />
    </div>
  );
};

export default CastingFilters;
