//
//  FileIO.h
//  iosBridge
//
//  Created by  didit on 10/10/18.
//  Copyright © 2018 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "React/RCTBridgeModule.h"

#import <UIKit/UIKit.h>

@interface FileIO : NSObject<RCTBridgeModule>
- (NSString*) resolvePath:(NSString*)name;
@end