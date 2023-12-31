package net.minecraft.advancements.critereon;

import com.google.gson.JsonObject;
import net.minecraft.resources.MinecraftKey;
import net.minecraft.server.level.EntityPlayer;
import net.minecraft.world.damagesource.DamageSource;

public class CriterionTriggerEntityHurtPlayer extends CriterionTriggerAbstract<CriterionTriggerEntityHurtPlayer.a> {

    static final MinecraftKey ID = new MinecraftKey("entity_hurt_player");

    public CriterionTriggerEntityHurtPlayer() {}

    @Override
    public MinecraftKey getId() {
        return CriterionTriggerEntityHurtPlayer.ID;
    }

    @Override
    public CriterionTriggerEntityHurtPlayer.a createInstance(JsonObject jsonobject, ContextAwarePredicate contextawarepredicate, LootDeserializationContext lootdeserializationcontext) {
        CriterionConditionDamage criterionconditiondamage = CriterionConditionDamage.fromJson(jsonobject.get("damage"));

        return new CriterionTriggerEntityHurtPlayer.a(contextawarepredicate, criterionconditiondamage);
    }

    public void trigger(EntityPlayer entityplayer, DamageSource damagesource, float f, float f1, boolean flag) {
        this.trigger(entityplayer, (criteriontriggerentityhurtplayer_a) -> {
            return criteriontriggerentityhurtplayer_a.matches(entityplayer, damagesource, f, f1, flag);
        });
    }

    public static class a extends CriterionInstanceAbstract {

        private final CriterionConditionDamage damage;

        public a(ContextAwarePredicate contextawarepredicate, CriterionConditionDamage criterionconditiondamage) {
            super(CriterionTriggerEntityHurtPlayer.ID, contextawarepredicate);
            this.damage = criterionconditiondamage;
        }

        public static CriterionTriggerEntityHurtPlayer.a entityHurtPlayer() {
            return new CriterionTriggerEntityHurtPlayer.a(ContextAwarePredicate.ANY, CriterionConditionDamage.ANY);
        }

        public static CriterionTriggerEntityHurtPlayer.a entityHurtPlayer(CriterionConditionDamage criterionconditiondamage) {
            return new CriterionTriggerEntityHurtPlayer.a(ContextAwarePredicate.ANY, criterionconditiondamage);
        }

        public static CriterionTriggerEntityHurtPlayer.a entityHurtPlayer(CriterionConditionDamage.a criterionconditiondamage_a) {
            return new CriterionTriggerEntityHurtPlayer.a(ContextAwarePredicate.ANY, criterionconditiondamage_a.build());
        }

        public boolean matches(EntityPlayer entityplayer, DamageSource damagesource, float f, float f1, boolean flag) {
            return this.damage.matches(entityplayer, damagesource, f, f1, flag);
        }

        @Override
        public JsonObject serializeToJson(LootSerializationContext lootserializationcontext) {
            JsonObject jsonobject = super.serializeToJson(lootserializationcontext);

            jsonobject.add("damage", this.damage.serializeToJson());
            return jsonobject;
        }
    }
}
