import { styled, StyledComponentProps } from '@ui-kitten/components';
import React from 'react';
import { FlexStyle, View, ViewProps } from 'react-native';
import { EdgeInsets, SafeAreaConsumer } from 'react-native-safe-area-context';

type Inset = 'top' | 'bottom';

interface IInsetProvider {
  toStyle: (insets: EdgeInsets, styles) => FlexStyle;
}

export interface ISafeAreaLayoutProps extends ViewProps, StyledComponentProps {
  insets?: Inset;
  children?: React.ReactNode;
}

const INSETS: Record<string, IInsetProvider> = {
  top: {
    toStyle: (insets: EdgeInsets, styles): FlexStyle => ({
      ...styles,
      paddingTop: insets.top,
    }),
  },
  bottom: {
    toStyle: (insets: EdgeInsets, styles): FlexStyle => ({
      ...styles,
      paddingBottom: insets.bottom,
    }),
  },
};

export class SafeAreaLayoutComponent extends React.Component<ISafeAreaLayoutProps> {
  static styledComponentName: string = 'SafeAreaLayout';

  public render(): React.ReactElement<ViewProps> {
    return (
      <SafeAreaConsumer>
        {this.renderComponent}
      </SafeAreaConsumer>
    );
  }

  private createInsets = (insets: Inset | Inset[], safeAreaInsets: EdgeInsets, style): FlexStyle[] => {
    return React.Children.map(insets, inset => INSETS[inset].toStyle(safeAreaInsets, style));
  };

  private renderComponent = (safeAreaInsets: EdgeInsets): React.ReactElement<ViewProps> => {
    const { style, insets, themedStyle, ...viewProps } = this.props;

    return (
      <View
        {...viewProps}
        style={[this.createInsets(insets, safeAreaInsets, themedStyle), style]}
      />
    );
  };
}

export const SafeAreaLayout = styled(SafeAreaLayoutComponent);