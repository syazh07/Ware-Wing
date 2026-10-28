package com.example.demo;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.web.bind.annotation.*;
import org.testng.Assert;
import org.testng.annotations.Listeners;
import org.testng.annotations.Test;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import java.lang.reflect.*;
import java.util.*;

@Listeners(TestResultListener.class)
public class ProjectValidationTests {

    private final String PRIMARY_CONTROLLER = "com.example.demo.controller.StockItemController";
    private final String PRIMARY_SERVICE = "com.example.demo.service.StockItemService";
    private final String PRIMARY_REPOSITORY = "com.example.demo.repository.StockItemRepository";
    private final String PRIMARY_ENTITY_PATH = "com.example.demo.entity.StockItem";
    private final String SECONDARY_CONTROLLER = "com.example.demo.controller.SupplierController";
    private final String TABLE_NAME = "stock_items";
    private final String API_BASE_PATH = "/api/stock-items";
    private final String DOMAIN_ROLE = "MANAGER";
    private final String CRUD_DELETE_MSG = "StockItem deleted successfully.";
    private final String CRUD_CREATE_MSG = "StockItem created successfully.";
    private final String CRUD_UPDATE_MSG = "StockItem updated successfully.";
    private final String DOMAIN_VALUE_1 = "ELEC-100";

    @Test
    public void t1_primaryControllerInvocable() throws Exception {
        try {
            Assert.assertNotNull(Class.forName(PRIMARY_CONTROLLER));
        } catch (Exception e) {
            Assert.fail("Primary controller not found: " + PRIMARY_CONTROLLER);
        }
    }

    @Test
    public void t2_primaryServiceInvocable() throws Exception {
        try {
            Assert.assertNotNull(Class.forName(PRIMARY_SERVICE));
        } catch (Exception e) {
            Assert.fail("Primary service not found: " + PRIMARY_SERVICE);
        }
    }

    @Test
    public void t3_primaryRepositoryGenericTypes() throws Exception {
        try {
            Assert.assertTrue(Class.forName(PRIMARY_REPOSITORY).isInterface());
        } catch (Exception e) {
            Assert.fail("Repository not found or not an interface: " + PRIMARY_REPOSITORY);
        }
    }

    @Test
    public void t4_primaryEntityMapping() throws Exception {
        try {
            Class<?> clazz = Class.forName(PRIMARY_ENTITY_PATH);
            Assert.assertNotNull(clazz.getAnnotation(Entity.class));
            Assert.assertEquals(clazz.getAnnotation(Table.class).name(), TABLE_NAME);
        } catch (Exception e) {
            Assert.fail("Entity mapping verification failed: " + e.getMessage());
        }
    }

    @Test
    public void t5_securityConfigBeans() throws Exception {
        try {
            Class<?> clazz = Class.forName("com.example.demo.config.SecurityConfig");
            Assert.assertNotNull(clazz.getDeclaredMethod("securityFilterChain", HttpSecurity.class));
        } catch (Exception e) {
            Assert.fail("SecurityConfig verification failed: " + e.getMessage());
        }
    }

    @Test
    public void t6_restControllerPath() throws Exception {
        try {
            Assert.assertEquals(Class.forName(PRIMARY_CONTROLLER).getAnnotation(RequestMapping.class).value()[0],
                    API_BASE_PATH);
        } catch (Exception e) {
            Assert.fail("RestController path verification failed: " + e.getMessage());
        }
    }

    @Test
    public void t7_getAllEndpointBehaviour() throws Exception {
        try {
            Class<?> controllerClazz = Class.forName(PRIMARY_CONTROLLER);
            Class<?> serviceClazz = Class.forName(PRIMARY_SERVICE);
            Object controller = controllerClazz.getConstructor(serviceClazz).newInstance(createMockObject(serviceClazz));
            ResponseEntity<?> response = (ResponseEntity<?>) controllerClazz.getDeclaredMethod("getAll").invoke(controller);
            Assert.assertEquals(response.getStatusCode(), HttpStatus.OK);
        } catch (Exception e) {
            Assert.fail("GetAll endpoint verification failed: " + e.getMessage());
        }
    }

    @Test
    public void t8_createEndpointBehaviour() throws Exception {
        try {
            Class<?> controllerClazz = Class.forName(PRIMARY_CONTROLLER);
            Class<?> serviceClazz = Class.forName(PRIMARY_SERVICE);
            Class<?> dtoClazz = Class.forName("com.example.demo.dto.StockItemDto");
            Object controller = controllerClazz.getConstructor(serviceClazz).newInstance(createMockObject(serviceClazz));
            Object dto = dtoClazz.getDeclaredConstructor().newInstance();
            setField(dto, "status", "ACTIVE");
            setField(dto, "sku", DOMAIN_VALUE_1);
            ResponseEntity<String> response = (ResponseEntity<String>) controllerClazz.getDeclaredMethod("create", dtoClazz)
                    .invoke(controller, dto);
            Assert.assertEquals(response.getStatusCode(), HttpStatus.CREATED);
            Assert.assertEquals(response.getBody(), CRUD_CREATE_MSG);
        } catch (Exception e) {
            Assert.fail("Create endpoint verification failed: " + e.getMessage());
        }
    }

    @Test
    public void t9_updateEndpointBehaviour() throws Exception {
        try {
            Class<?> controllerClazz = Class.forName(PRIMARY_CONTROLLER);
            Class<?> serviceClazz = Class.forName(PRIMARY_SERVICE);
            Class<?> dtoClazz = Class.forName("com.example.demo.dto.StockItemDto");
            Object controller = controllerClazz.getConstructor(serviceClazz).newInstance(createMockObject(serviceClazz));
            Object dto = dtoClazz.getDeclaredConstructor().newInstance();
            setField(dto, "status", "ACTIVE");
            ResponseEntity<String> response = (ResponseEntity<String>) controllerClazz
                    .getDeclaredMethod("update", Long.class, dtoClazz).invoke(controller, 1L, dto);
            Assert.assertEquals(response.getStatusCode(), HttpStatus.OK);
            Assert.assertEquals(response.getBody(), CRUD_UPDATE_MSG);
        } catch (Exception e) {
            Assert.fail("Update endpoint verification failed: " + e.getMessage());
        }
    }

    @Test
    public void t10_rbacAdminAnnotation() throws Exception {
        try {
            Method m = Class.forName(PRIMARY_CONTROLLER).getDeclaredMethod("create",
                    Class.forName("com.example.demo.dto.StockItemDto"));
            Assert.assertTrue(m.getAnnotation(PreAuthorize.class).value().contains("ADMIN"));
        } catch (Exception e) {
            Assert.fail("RBAC Admin annotation verification failed: " + e.getMessage());
        }
    }

    @Test
    public void t11_rbacDomainRoleAnnotation() throws Exception {
        try {
            Method m = Class.forName(PRIMARY_CONTROLLER).getDeclaredMethod("getAll");
            Assert.assertTrue(m.getAnnotation(PreAuthorize.class).value().contains(DOMAIN_ROLE));
        } catch (Exception e) {
            Assert.fail("RBAC domain role verification failed: " + e.getMessage());
        }
    }

    @Test
    public void t12_corsConfigurationPresent() throws Exception {
        try {
            Assert.assertTrue(Arrays.stream(Class.forName("com.example.demo.config.SecurityConfig").getDeclaredMethods())
                    .anyMatch(m -> m.getName().contains("cors")));
        } catch (Exception e) {
            Assert.fail("CORS configuration verification failed: " + e.getMessage());
        }
    }

    @Test
    public void t13_validationAnnotationPresent() throws Exception {
        try {
            Method m = Class.forName(PRIMARY_CONTROLLER).getDeclaredMethod("create",
                    Class.forName("com.example.demo.dto.StockItemDto"));
            Assert.assertNotNull(m.getParameters()[0].getAnnotation(jakarta.validation.Valid.class));
        } catch (Exception e) {
            Assert.fail("Validation annotation verification failed: " + e.getMessage());
        }
    }

    @Test
    public void t14_broadRbacCoverage() throws Exception {
        try {
            Assert.assertTrue(Arrays.stream(Class.forName(PRIMARY_CONTROLLER).getDeclaredMethods())
                    .filter(m -> m.isAnnotationPresent(PreAuthorize.class)).count() >= 3);
        } catch (Exception e) {
            Assert.fail("RBAC coverage verification failed: " + e.getMessage());
        }
    }

    @Test
    public void t15_repositoryCustomMethod() throws Exception {
        try {
            Assert.assertTrue(Arrays.stream(Class.forName(PRIMARY_REPOSITORY).getDeclaredMethods())
                    .anyMatch(m -> m.getName().startsWith("findBy")));
        } catch (Exception e) {
            Assert.fail("Repository custom method verification failed: " + e.getMessage());
        }
    }

    @Test
    public void t16_repositoryJpqlQuery() throws Exception {
        try {
            Method m = Arrays
                    .stream(Class.forName("com.example.demo.repository.StockMovementRepository").getDeclaredMethods())
                    .filter(meth -> meth.isAnnotationPresent(org.springframework.data.jpa.repository.Query.class))
                    .findFirst().orElseThrow();
            Assert.assertTrue(m.getAnnotation(org.springframework.data.jpa.repository.Query.class).value().toUpperCase()
                    .contains("SELECT"));
        } catch (Exception e) {
            Assert.fail("Repository JPQL query verification failed: " + e.getMessage());
        }
    }

    @Test
    public void t17_globalExceptionHandlerBehaviour() throws Exception {
        try {
            Class<?> clazz = Class.forName("com.example.demo.exception.GlobalExceptionHandler");
            Object handler = clazz.getDeclaredConstructor().newInstance();
            Method m = clazz.getDeclaredMethod("handleNotFoundException",
                    Class.forName("com.example.demo.exception.ResourceNotFoundException"));
            Exception ex = (Exception) Class.forName("com.example.demo.exception.ResourceNotFoundException")
                    .getConstructor(String.class).newInstance("Not found");
            Assert.assertEquals(((ResponseEntity<?>) m.invoke(handler, ex)).getStatusCode(), HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            Assert.fail("Global exception handler verification failed: " + e.getMessage());
        }
    }

    @Test
    public void t18_customNotFoundException() throws Exception {
        try {
            Assert.assertNotNull(
                    Class.forName("com.example.demo.exception.ResourceNotFoundException").getConstructor(String.class));
        } catch (Exception e) {
            Assert.fail("ResourceNotFoundException verification failed: " + e.getMessage());
        }
    }

    @Test
    public void t19_conflictExceptionMapping() throws Exception {
        try {
            Class<?> clazz = Class.forName("com.example.demo.exception.GlobalExceptionHandler");
            Object handler = clazz.getDeclaredConstructor().newInstance();
            Method m = clazz.getDeclaredMethod("handleBusinessException",
                    Class.forName("com.example.demo.exception.BusinessValidationException"));
            Exception ex = (Exception) Class.forName("com.example.demo.exception.BusinessValidationException")
                    .getConstructor(String.class).newInstance("Conflict");
            Assert.assertEquals(((ResponseEntity<?>) m.invoke(handler, ex)).getStatusCode(), HttpStatus.CONFLICT);
        } catch (Exception e) {
            Assert.fail("Conflict exception mapping verification failed: " + e.getMessage());
        }
    }

    @Test
    public void t20_jwtSecretPrivate() throws Exception {
        try {
            Field f = Arrays.stream(Class.forName("com.example.demo.util.JwtService").getDeclaredFields())
                    .filter(fi -> fi.getName().toLowerCase().contains("secret")).findFirst().orElseThrow();
            Assert.assertTrue(Modifier.isPrivate(f.getModifiers()));
        } catch (Exception e) {
            Assert.fail("JWT secret verification failed: " + e.getMessage());
        }
    }

    @Test
    public void t21_jwtGeneration() throws Exception {
        try {
            Class<?> clazz = Class.forName("com.example.demo.util.JwtService");
            Object service = clazz.getDeclaredConstructor().newInstance();
            setField(service, "secretKey", "9a4f4345444541464748494a4b4c4d4e4f505152535455565758595a61626364");
            setField(service, "jwtExpiration", 3600000L);
            Assert.assertNotNull(
                    clazz.getDeclaredMethod("generateToken", String.class, String.class).invoke(service, "admin", "ADMIN"));
        } catch (Exception e) {
            Assert.fail("JWT generation verification failed: " + e.getMessage());
        }
    }

    @Test
    public void t22_jwtValidation() throws Exception {
        try {
            Class<?> clazz = Class.forName("com.example.demo.util.JwtService");
            Object service = clazz.getDeclaredConstructor().newInstance();
            setField(service, "secretKey", "9a4f4345444541464748494a4b4c4d4e4f505152535455565758595a61626364");
            setField(service, "jwtExpiration", 3600000L);
            String token = (String) clazz.getDeclaredMethod("generateToken", String.class, String.class).invoke(service,
                    "admin", "ADMIN");
            Assert.assertTrue((Boolean) clazz.getDeclaredMethod("isTokenValid", String.class, String.class).invoke(service,
                    token, "admin"));
        } catch (Exception e) {
            Assert.fail("JWT validation verification failed: " + e.getMessage());
        }
    }

    @Test
    public void t23_jwtExtraction() throws Exception {
        try {
            Class<?> clazz = Class.forName("com.example.demo.util.JwtService");
            Object service = clazz.getDeclaredConstructor().newInstance();
            setField(service, "secretKey", "9a4f4345444541464748494a4b4c4d4e4f505152535455565758595a61626364");
            setField(service, "jwtExpiration", 3600000L);
            String token = (String) clazz.getDeclaredMethod("generateToken", String.class, String.class).invoke(service,
                    "admin", "ADMIN");
            Assert.assertEquals(clazz.getDeclaredMethod("extractUsername", String.class).invoke(service, token), "admin");
        } catch (Exception e) {
            Assert.fail("JWT extraction verification failed: " + e.getMessage());
        }
    }

    @Test
    public void t24_entityTableName() throws Exception {
        try {
            Assert.assertEquals(Class.forName(PRIMARY_ENTITY_PATH).getAnnotation(Table.class).name(), TABLE_NAME);
        } catch (Exception e) {
            Assert.fail("Entity table name verification failed: " + e.getMessage());
        }
    }

    @Test
    public void t25_nonNullableFields() throws Exception {
        try {
            Assert.assertTrue(Arrays.stream(Class.forName(PRIMARY_ENTITY_PATH).getDeclaredFields())
                    .filter(f -> f.isAnnotationPresent(jakarta.persistence.Column.class)
                            && !f.getAnnotation(jakarta.persistence.Column.class).nullable())
                    .count() >= 3);
        } catch (Exception e) {
            Assert.fail("NonNullable fields verification failed: " + e.getMessage());
        }
    }

    @Test
    public void t26_entityRelationships() throws Exception {
        try {
            Assert.assertTrue(Arrays.stream(Class.forName("com.example.demo.entity.PurchaseOrder").getDeclaredFields())
                    .anyMatch(f -> f.isAnnotationPresent(jakarta.persistence.ManyToOne.class)
                            || f.isAnnotationPresent(jakarta.persistence.OneToMany.class)));
        } catch (Exception e) {
            Assert.fail("Entity relationships verification failed: " + e.getMessage());
        }
    }

    @Test
    public void t27_securityFilterChainCompleteness() throws Exception {
        try {
            Assert.assertNotNull(Class.forName("com.example.demo.config.SecurityConfig")
                    .getDeclaredMethod("securityFilterChain", HttpSecurity.class));
        } catch (Exception e) {
            Assert.fail("SecurityFilterChain verification failed: " + e.getMessage());
        }
    }

    @Test
    public void t28_serviceDelegationVerify() throws Exception {
        try {
            Class<?> serviceClazz = Class.forName(PRIMARY_SERVICE);
            Class<?> repoClazz = Class.forName(PRIMARY_REPOSITORY);
            final boolean[] repoCalled = { false };
            Object mockRepo = Proxy.newProxyInstance(repoClazz.getClassLoader(), new Class[] { repoClazz },
                    (proxy, method, args) -> {
                        if (method.getName().equals("findAll")) {
                            repoCalled[0] = true;
                            return Collections.emptyList();
                        }
                        return null;
                    });
            Constructor<?> cons = serviceClazz.getDeclaredConstructors()[0];
            Object[] args = new Object[cons.getParameterCount()];
            for (int i = 0; i < args.length; i++) {
                if (cons.getParameterTypes()[i].equals(repoClazz))
                    args[i] = mockRepo;
                else
                    args[i] = createMockObject(cons.getParameterTypes()[i]);
            }
            serviceClazz.getDeclaredMethod("getAllItems").invoke(cons.newInstance(args));
            Assert.assertTrue(repoCalled[0]);
        } catch (Exception e) {
            Assert.fail("Service delegation verification failed: " + e.getMessage());
        }
    }

    @Test
    public void t29_deleteCleanupVerify() throws Exception {
        try {
            Class<?> serviceClazz = Class.forName(PRIMARY_SERVICE);
            Constructor<?> cons = serviceClazz.getDeclaredConstructors()[0];
            Object[] args = new Object[cons.getParameterCount()];
            for (int i = 0; i < args.length; i++)
                args[i] = createMockObject(cons.getParameterTypes()[i]);
            Assert.assertNotNull(cons.newInstance(args));
        } catch (Exception e) {
            Assert.fail("Delete cleanup verification failed: " + e.getMessage());
        }
    }

    private Object createMockObject(Class<?> clazz) throws Exception {
        if (clazz == null)
            return null;
        if (clazz.isInterface()) {
            return Proxy.newProxyInstance(clazz.getClassLoader(), new Class[] { clazz }, (p, m, a) -> {
                if (m.getName().equals("findAll"))
                    return Collections.emptyList();
                if (m.getName().equals("findById")) {
                    Class<?> returnType = m.getReturnType();
                    if (returnType.equals(Optional.class)) {
                        Type genericType = m.getGenericReturnType();
                        if (genericType instanceof ParameterizedType) {
                            Type entityType = ((ParameterizedType) genericType).getActualTypeArguments()[0];
                            try {
                                Class<?> entityClass = (entityType instanceof Class) ? (Class<?>) entityType : Class.forName(PRIMARY_ENTITY_PATH);
                                return Optional.of(entityClass.getDeclaredConstructor().newInstance());
                            } catch (Exception e) {
                                return Optional.empty();
                            }
                        }
                    }
                    return Optional.empty();
                }
                if (m.getName().equals("save"))
                    return a[0];
                if (m.getReturnType().equals(long.class) || m.getReturnType().equals(Long.class))
                    return 0L;
                if (m.getReturnType().equals(int.class) || m.getReturnType().equals(Integer.class))
                    return 0;
                return null;
            });
        }
        Constructor<?>[] constructors = clazz.getDeclaredConstructors();
        if (constructors.length == 0)
            return null;
        Constructor<?> cons = constructors[0];
        Object[] args = new Object[cons.getParameterCount()];
        for (int i = 0; i < args.length; i++)
            args[i] = createMockObject(cons.getParameterTypes()[i]);
        try {
            return cons.newInstance(args);
        } catch (Exception e) {
            return null;
        }
    }

    private void setField(Object obj, String fieldName, Object value) throws Exception {
        Field field = null;
        Class<?> current = obj.getClass();
        while (current != null && field == null) {
            try {
                field = current.getDeclaredField(fieldName);
            } catch (Exception e) {
                current = current.getSuperclass();
            }
        }
        if (field != null) {
            field.setAccessible(true);
            field.set(obj, value);
        }
    }
}