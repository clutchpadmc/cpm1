package net.minecraft.server.level;

import net.minecraft.core.SectionPosition;
import net.minecraft.world.level.lighting.LightEngineGraph;

public abstract class LightEngineGraphSection extends LightEngineGraph {

    protected LightEngineGraphSection(int i, int j, int k) {
        super(i, j, k);
    }

    @Override
    protected void checkNeighborsAfterUpdate(long i, int j, boolean flag) {
        if (!flag || j < this.levelCount - 2) {
            for (int k = -1; k <= 1; ++k) {
                for (int l = -1; l <= 1; ++l) {
                    for (int i1 = -1; i1 <= 1; ++i1) {
                        long j1 = SectionPosition.offset(i, k, l, i1);

                        if (j1 != i) {
                            this.checkNeighbor(i, j1, j, flag);
                        }
                    }
                }
            }

        }
    }

    @Override
    protected int getComputedLevel(long i, long j, int k) {
        int l = k;

        for (int i1 = -1; i1 <= 1; ++i1) {
            for (int j1 = -1; j1 <= 1; ++j1) {
                for (int k1 = -1; k1 <= 1; ++k1) {
                    long l1 = SectionPosition.offset(i, i1, j1, k1);

                    if (l1 == i) {
                        l1 = Long.MAX_VALUE;
                    }

                    if (l1 != j) {
                        int i2 = this.computeLevelFromNeighbor(l1, i, this.getLevel(l1));

                        if (l > i2) {
                            l = i2;
                        }

                        if (l == 0) {
                            return l;
                        }
                    }
                }
            }
        }

        return l;
    }

    @Override
    protected int computeLevelFromNeighbor(long i, long j, int k) {
        return this.isSource(i) ? this.getLevelFromSource(j) : k + 1;
    }

    protected abstract int getLevelFromSource(long i);

    public void update(long i, int j, boolean flag) {
        this.checkEdge(Long.MAX_VALUE, i, j, flag);
    }
}
