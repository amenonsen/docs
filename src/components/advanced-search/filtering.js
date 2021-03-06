import React from 'react';
import { Badge } from 'react-bootstrap';
import {
  connectMenu,
  connectHierarchicalMenu,
  connectCurrentRefinements,
} from 'react-instantsearch-dom';
import { products } from '../../constants/products';
import { capitalize } from '../../constants/utils';

const typeToContentType = {
  doc: { name: 'Documentation' },
  guide: { name: 'Guides' },
};

const RadioInput = ({ labelText, badgeNumber, showBadge, id, name, onChange, checked }) => (
  <div className="form-check">
    <input
      type='radio'
      className='form-check-input'
      id={id}
      name={name}
      onChange={onChange}
      checked={checked}
      aria-label={id}
    />
    <label
      htmlFor={id}
      className="form-check-label"
    >
      {labelText}
      <Badge
        variant="secondary"
        className="ml-2 align-middle search-filter-badge"
      >
        {showBadge && badgeNumber}
      </Badge>
    </label>
  </div>
)

const RadioRefinement = ({ attribute, heading, items, queryActive, refine, show, translation = {} }) => {
  const radioName = `radio-refinement-${attribute}`;
  const refinedItem = items.find((item) => item.isRefined);

  return (
    <div className={`mb-4 pl-1 ${!show && 'd-none'}`}>
      <div className='mb-2 font-weight-bold text-muted text-uppercase small'>{heading || capitalize(attribute)}</div>
      <RadioInput
        id={`radio-refinement-${attribute}-all`}
        name={radioName}
        labelText='All'
        badgeNumber={items.reduce((total, item) => total + item.count, 0)}
        showBadge={queryActive}
        onChange={() => refine(refinedItem.value)}
        checked={!refinedItem}
      />
      {items.map(item => (
        <RadioInput
          key={item.label}
          id={`radio-refinement-${attribute}-${item.label}`}
          name={radioName}
          labelText={translation[item.label] ? translation[item.label].name : capitalize(item.label)}
          badgeNumber={item.count}
          showBadge={queryActive}
          onChange={() => refine(item.value)}
          checked={refinedItem === item}
        />
      ))}
    </div>
  );
};

const ContentTypeRefinement = connectMenu(
  ({ items, currentRefinement, refine, queryActive }) => (
    <RadioRefinement
      attribute='type'
      items={items}
      queryActive={queryActive}
      refine={refine}
      show={true}
      translation={typeToContentType}
    />
  )
);

const ProductVersionRefinement = connectHierarchicalMenu(
  ({ items, currentRefinement, refine, queryActive, show }) => {
    const refinedProduct = items.find((item) => item.isRefined);

    return (
      <>
        <RadioRefinement
          attribute='product'
          items={items}
          queryActive={queryActive}
          refine={refine}
          show={show}
          translation={products}
        />
        {refinedProduct &&
          <RadioRefinement
            attribute='version'
            items={refinedProduct.items}
            queryActive={queryActive}
            refine={refine}
            show={show}
          />
        }
      </>
    );
  }
);

const ClearRefinements = connectCurrentRefinements(
  ({ items, refine }) => {
    const clear = (e) => {
      refine(items);
      e.preventDefault();
    };

    if (items.length > 0) {
      return <a href='/' onClick={clear}>Clear Filters</a>;
    }
    return null;
  }
);

export const AdvancedSearchFiltering = connectCurrentRefinements(
  ({ items, queryActive }) => {
    const showProductVersionFilters = !items.find((item) => {
      return item.attribute === 'type' && item.currentRefinement === 'guide';
    });

    return (
      <>
        <ContentTypeRefinement
          attribute='type'
          queryActive={queryActive}
          heading='Content Type'
        />
        <ProductVersionRefinement
          attributes={['product', 'productVersion']}
          show={showProductVersionFilters}
          queryActive={queryActive}
        />
        <ClearRefinements />
      </>
    );
  }
);
