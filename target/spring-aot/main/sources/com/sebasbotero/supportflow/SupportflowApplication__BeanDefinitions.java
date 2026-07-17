package com.sebasbotero.supportflow;

import org.springframework.aot.generate.Generated;
import org.springframework.beans.factory.config.BeanDefinition;
import org.springframework.beans.factory.support.RootBeanDefinition;

/**
 * Bean definitions for {@link SupportflowApplication}.
 */
@Generated
public class SupportflowApplication__BeanDefinitions {
  /**
   * Get the bean definition for 'supportflowApplication'.
   */
  public static BeanDefinition getSupportflowApplicationBeanDefinition() {
    RootBeanDefinition beanDefinition = new RootBeanDefinition(SupportflowApplication.class);
    beanDefinition.setInstanceSupplier(SupportflowApplication::new);
    return beanDefinition;
  }
}
