import { getFocusStyle, getRTL, getTheme, Icon, ITheme, List, mergeStyleSets, TextField } from "@fluentui/react";
import { Image, ImageFit } from '@fluentui/react/lib/Image';
import { FocusZone, FocusZoneDirection } from "@fluentui/react/lib/FocusZone";
import React from "react";
import { useConst } from '@fluentui/react-hooks';

const theme: ITheme = getTheme();
const { palette, semanticColors, fonts } = theme;

const classNames = mergeStyleSets({
  itemCell: [
    getFocusStyle(theme, { inset: -1 }),
    {
      minHeight: 54,
      padding: 10,
      boxSizing: 'border-box',
      borderBottom: `1px solid ${semanticColors.bodyDivider}`,
      display: 'flex',
      selectors: {
        '&:hover': { background: palette.neutralLight },
      },
    },
  ],
  itemImage: {
    flexShrink: 0,
  },
  itemContent: {
    marginLeft: 10,
    overflow: 'hidden',
    flexGrow: 1,
  },
  itemName: [
    fonts.xLarge,
    {
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    },
  ],
  itemIndex: {
    fontSize: fonts.small.fontSize,
    color: palette.neutralTertiary,
    marginBottom: 10,
  },
  chevron: {
    alignSelf: 'center',
    marginLeft: 10,
    color: palette.neutralTertiary,
    fontSize: fonts.large.fontSize,
    flexShrink: 0,
  },
});

class IExampleItem {
    name: string;
    description: string;
    company: string;
}
const onRenderCell = (item?: IExampleItem, index?: number | undefined): JSX.Element => {
    if(!item) {return <></>}
    return (
      <div className={classNames.itemCell} data-is-focusable={true}>
        <div className={classNames.itemContent}>
          <div className={classNames.itemName}>{item.name}</div>
          <div className={classNames.itemIndex}>{item.company}</div>
          <div>{item.description}</div>
        </div>
        <Icon className={classNames.chevron} iconName={getRTL() ? 'ChevronLeft' : 'ChevronRight'} />
      </div>
    );
  };
  
export const Jobs: React.FunctionComponent = () => {
    const originalItems = useConst(() => createListItems(5000));
    React.useEffect(() => {
        fetch('http://localhost:1337/api/jobs?populate=company')
          .then(results => results.json())
          .then(data => {
            console.log('inside items')
            let items = []
            for(let i=0;i<data.data.length ;i++){
                const {title, location, company} = data.data[i].attributes;
                let item = new IExampleItem();
                item = {name: title, description: location, company: company.data.attributes.name};
                items[i] = item
            }
            setItems(items)
          });
      }, []);
  const [items, setItems] = React.useState(originalItems);

  const resultCountText =
    items.length === originalItems.length ? '' : ` (${items.length} of ${originalItems.length} shown)`;

  const onFilterChanged = (_: any, text: string): void => {
    setItems(originalItems.filter(item => item.name.toLowerCase().indexOf(text.toLowerCase()) >= 0));
  };

  return (
    <FocusZone direction={FocusZoneDirection.vertical}>
      <List items={items} onRenderCell={onRenderCell} />
    </FocusZone>
  );
}

function createListItems(arg0: number): Array<IExampleItem> {
    return [{name: "newName", description: "someDescription", company: "someCompany"}]
}
