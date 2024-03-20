import React from 'react';
import { createContextScope } from '../../common/context';
import type * as Jelly from '../Primitive';
import { Slot } from '../Slot';
import { useComposedRefs } from '../../common/utils';

type SlotProps = Jelly.ComponentPropsWithoutRef<typeof Slot>;
type CollectionElement = HTMLElement;
interface CollectionProps extends SlotProps {
  scope: any;
}

function createCollection<ItemElement extends HTMLElement, ItemData = {}>(
  name: string,
) {
  const PROVIDER_NAME = `${name}CollectionProvider`;
  const [createCollectionContext, createCollectionScope] =
    createContextScope(PROVIDER_NAME);

  interface ContextValue {
    collectionRef: React.RefObject<CollectionElement>;
    itemMap: Map<
      React.RefObject<ItemElement>,
      { ref: React.RefObject<ItemElement> } & ItemData
    >;
  }

  const [CollectionProviderImpl, useCollectionContext] =
    createCollectionContext<ContextValue>(PROVIDER_NAME, {
      collectionRef: { current: null },
      itemMap: new Map(),
    });

  const CollectionProvider: React.FC<{
    scope: any;
    children?: React.ReactNode;
  }> = ({ scope, children }) => {
    const ref = React.useRef<CollectionElement>(null);
    const itemMap = React.useRef<ContextValue['itemMap']>(new Map()).current;

    return (
      <CollectionProviderImpl
        scope={scope}
        collectionRef={ref}
        itemMap={itemMap}
      >
        {children}
      </CollectionProviderImpl>
    );
  };

  CollectionProvider.displayName = PROVIDER_NAME;

  const COLLECTION_SLOT_NAME = `${name}CollectionSlot`;

  const CollectionSlot = React.forwardRef<CollectionElement, CollectionProps>(
    ({ scope, children }, forwardedRef) => {
      const context = useCollectionContext(COLLECTION_SLOT_NAME, scope);
      const composedRefs = useComposedRefs(forwardedRef, context.collectionRef);

      return <Slot ref={composedRefs}>{children}</Slot>;
    },
  );

  CollectionSlot.displayName = COLLECTION_SLOT_NAME;

  const ITEM_SLOT_NAME = `${name}CollectionItemSlot`;
  const ITEM_DATA_ATTR = 'data-collection-item';

  type CollectionItemSlotProps = ItemData & {
    scope: any;
    children: React.ReactNode;
  };

  const CollectionItemSlot = React.forwardRef<
    ItemElement,
    CollectionItemSlotProps
  >(({ scope, children, ...itemData }, forwardedRef) => {
    const ref = React.useRef<ItemElement>(null);
    const composedRefs = useComposedRefs(forwardedRef, ref);
    const context = useCollectionContext(ITEM_SLOT_NAME, scope);

    React.useEffect(() => {
      context.itemMap.set(ref, { ref, ...(itemData as unknown as ItemData) });

      return () => void context.itemMap.delete(ref);
    });

    return (
      <Slot ref={composedRefs} {...{ [ITEM_DATA_ATTR]: '' }}>
        {children}
      </Slot>
    );
  });

  CollectionItemSlot.displayName = ITEM_SLOT_NAME;

  const useCollection = (scope: any) => {
    const context = useCollectionContext(`${name}CollectionConsumer`, scope);

    const getItems = React.useCallback(() => {
      const collectionNode = context.collectionRef.current;
      if (!collectionNode) return [];

      const orderedNodes = Array.from(
        collectionNode.querySelectorAll(`[${ITEM_DATA_ATTR}]`),
      );
      const items = Array.from(context.itemMap.values());
      const orderedItems = items.sort(
        (a, b) =>
          orderedNodes.indexOf(a.ref.current!) -
          orderedNodes.indexOf(b.ref.current!),
      );

      return orderedItems;
    }, [context.collectionRef, context.itemMap]);

    return getItems;
  };

  return [
    {
      Provider: CollectionProvider,
      Slot: CollectionSlot,
      ItemSlot: CollectionItemSlot,
    },
    useCollection,
    createCollectionScope,
  ] as const;
}

export { createCollection };
export type { CollectionProps };
